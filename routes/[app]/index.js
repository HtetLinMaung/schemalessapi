const { brewBlankExpressFunc } = require("code-alchemy");
const verifyToken = require("../../middlewares/verify-token");
const Quest = require("../../models/Quest");
const QuestScriptPivot = require("../../models/QuestScriptPivot");
const Script = require("../../models/Script");
const connectMongoose = require("../../utils/connect-mongoose");
const getModelFromDefinition = require("../../utils/get-model-from-definition");

Script;
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

  let done = false;
  const context = {
    getModel: getModelFromDefinition,
    req,
    res: {
      status: 200,
      body: null,
    },
    done: () => {
      done = true;
    },
  };

  const intervalId = setInterval(() => {
    if (done) {
      res
        .status("status" in context.res ? context.res.status : 200)
        .send(context.res.body);
      clearInterval(intervalId);
    }
  }, 50);

  for (const questScript of questScripts) {
    if (questScript.script.scriptType == "inline") {
      if (questScript.script.script.includes("async")) {
        await eval(questScript.script.script)(context);
      } else {
        eval(questScript.script.script)(context);
      }
    }
  }
  done = true;
});
