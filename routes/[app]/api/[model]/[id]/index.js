const { brewBlankExpressFunc } = require("code-alchemy");
const setModel = require("../../../../../middlewares/set-model");
const verifyToken = require("../../../../../middlewares/verify-token");
const generateFilter = require("../../../../../utils/generate-filter");

const getById = async (req) => {
  let data = null;
  if (req.Model) {
    const filter = generateFilter(req);
    filter["_id"] = req.params.id;
    let projections = null;
    if (req.query.$attributes) {
      req.query["$projections"] = req.query.$attributes;
    }
    if (req.query.$select) {
      req.query["$projections"] = req.query.$select;
    }
    if (req.query.$projections) {
      projections =
        req.query.$projections.includes("{") &&
        req.query.$projections.includes("}")
          ? JSON.parse(req.query.$projections)
          : req.query.$projections;
    }

    let cursor = null;

    if (projections) {
      cursor = req.Model.findOne(filter, projections);
    } else {
      cursor = req.Model.findOne(filter);
    }

    if ("$populate" in req.query) {
      const populate =
        req.query.$populate.includes("[") && req.query.$populate.includes("]")
          ? JSON.parse(req.query.$populate)
          : req.query.$populate;
      cursor = cursor.populate(populate);
    }

    data = await cursor.exec();
  }
  return data;
};

const handleGet = async (req, res) => {
  const data = await getById(req);
  if (!data) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }

  const resBody = {
    code: 200,
    message: "Data fetched successfully.",
    data,
  };
  console.log(resBody);
  res.json(resBody);
};

const handleUpdate = async (req, res) => {
  const data = await getById(req);
  if (!data) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }

  for (const [k, v] of Object.entries(req.body)) {
    if (!k.startsWith("_")) {
      data[k] = v;
    }
  }
  await data.save();

  const resBody = {
    code: 200,
    message: "Updated succesfully.",
    data,
  };
  console.log(resBody);
  res.json(resBody);
};

const handleDelete = async (req, res) => {
  const data = await getById(req);
  if (!data) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }
  await data.remove();
  const resBody = {
    code: 204,
    message: "Deleted succesfully.",
  };
  console.log(resBody);
  res.json(resBody);
};

module.exports = brewBlankExpressFunc(async (req, res) => {
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
  await setModel(req);
  switch (req.method.toLowerCase()) {
    case "put":
    case "patch":
      await handleUpdate(req, res);
      break;
    case "delete":
      await handleDelete(req, res);
      break;
    default:
      await handleGet(req, res);
  }
});
