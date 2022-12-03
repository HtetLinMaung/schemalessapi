const { brewBlankExpressFunc } = require("code-alchemy");
const verifyToken = require("../../middlewares/verify-token");
const connectMongoose = require("../../utils/connect-mongoose");
const getModelFromDefinition = require("../../utils/get-model-from-definition");
const packageJson = require("../../package.json");

const modules = {};

if (packageJson.dependencies) {
  for (const moduleName in packageJson.dependencies) {
    try {
      modules[moduleName] = require(moduleName);
    } catch (err) {
      console.log(err);
    }
  }
}

const setImmediateAsync = async () =>
  new Promise((resolve) => setImmediate(resolve));

module.exports = brewBlankExpressFunc(async (req, res) => {
  console.log({
    body: req.body,
    query: req.query,
    params: req.params,
    url: req.url,
    path: req.path,
    method: req.method,
    headers: req.headers,
  });
  if (req.params.app != process.env.route_prefix) {
    const resBody = "Not Found!";
    console.log(resBody);
    return res.status(404).send(resBody);
  }
  if (process.env.authentication_logic == "on") {
    const { status, json } = verifyToken(req);
    if (status != 200) {
      return res.status(status).json(json);
    }
  }
  await connectMongoose();
  const Quest = await getModelFromDefinition("Quest");
  const QuestScriptPivot = await getModelFromDefinition("QuestScriptPivot");
  const Script = await getModelFromDefinition("Script");
  Script;
  const quest = await Quest.findOne(
    {
      url: {
        $regex: req.path,
      },
      method: req.method.toLowerCase(),
    },
    "_id"
  );
  if (!quest) {
    return res.status(404).send("Not found!");
  }

  const questScripts = await QuestScriptPivot.find({ quest: quest._id })
    .sort({ stage: 1 })
    .populate("script");

  const context = {
    utils: {
      getModel: getModelFromDefinition,
      setImmediateAsync,
    },
    modules,
    req,
    res: {
      status: 200,
      body: null,
    },
  };

  for (const questScript of questScripts) {
    let result = null;
    if (questScript.script.scriptType == "inline") {
      if (
        questScript.script.script.includes("async") ||
        questScript.script.script.includes("__awaiter")
      ) {
        result = await eval(questScript.script.script)(context);
      } else {
        result = eval(questScript.script.script)(context);
      }
    } else {
      const func = require(questScript.script.script);
      if (
        func.toString().includes("async") ||
        func.toString().includes("__awaiter")
      ) {
        result = await func(context);
      } else {
        result = func(context);
      }
    }
    if (result && typeof result == "object" && !Array.isArray(result)) {
      context.res = result;
      break;
    }
  }
  let cursor = res.status("status" in context.res ? context.res.status : 200);
  if (typeof context.res.body == "object") {
    cursor.json(context.res.body);
  } else {
    cursor.send(context.res.body);
  }
});
