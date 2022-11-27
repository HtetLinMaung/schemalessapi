const { brewBlankExpressFunc } = require("code-alchemy");
const mongoose = require("mongoose");
const setModel = require("../../../../middlewares/set-model");
const ModelDefinition = require("../../../../models/ModelDefinition");
const generateFilter = require("../../../../utils/generate-filter");
const jsonToSchema = require("../../../../utils/json-to-schema");

const handlePost = async (req, res) => {
  if (!req.Model) {
    const { model } = req.params;
    const [schemaBody, dbSchemaBody] = jsonToSchema(req.body || {});
    const modelDefinition = ModelDefinition({
      schema: dbSchemaBody,
      modelName: model,
      options: { timestamps: true },
      indexes: [
        {
          fields: { "$**": "text" },
          options: {},
        },
      ],
    });
    modelDefinition.save();
    const schema = new mongoose.Schema(schemaBody, { timestamps: true });
    schema.index({ "$**": "text" });
    req.Model = mongoose.models[model] || mongoose.model(model, schema);
  }
  const data = req.Model(req.body || {});
  await data.save();
  const resBody = {
    code: 200,
    message: "Data created successful!",
    data,
  };
  console.log(resBody);
  res.json(resBody);
};

const handleGet = async (req, res) => {
  let data = [];
  let total = 0;
  let page = 1;
  let perpage = 0;
  let pagecount = 0;

  if (req.Model) {
    const filter = generateFilter(req);
    let projections = null;
    if (req.query.$projections) {
      projections =
        req.query.$projections.includes("{") &&
        req.query.$projections.includes("}")
          ? JSON.parse(req.query.$projections)
          : req.query.$projections;
    }

    let cursor = null;

    if (projections) {
      cursor = req.Model.find(filter, projections);
    } else {
      cursor = req.Model.find(filter);
    }

    if ("$populate" in req.query) {
      const populate =
        req.query.$populate.includes("{") && req.query.$populate.includes("}")
          ? JSON.parse(req.query.$populate)
          : req.query.$populate;
      cursor = cursor.populate(populate);
    }

    if ("$sort" in req.query) {
      cursor = cursor.sort(JSON.parse(req.query.$sort));
    }

    if ("$page" in req.query && "$perpage" in req.query) {
      perpage = parseInt(req.query.$perpage);
      page = parseInt(req.query.$page);
      const offset = (page - 1) * perpage;
      cursor = cursor.skip(offset).limit(perpage);
      total = await req.Model.countDocuments(filter);
    }

    data = await cursor.exec();
    if (!total) {
      total = data.length;
    }
    if (!perpage) {
      perpage = total;
    }
  }

  if (!total && !perpage) {
    pagecount = 0;
  } else {
    pagecount = Math.ceil(total / perpage);
  }
  const resBody = {
    code: 200,
    message: "Data fetched successfully.",
    data,
    total,
    page,
    perpage,
    pagecount,
  };
  console.log(resBody);
  res.json(resBody);
};

const handleUpdate = async (req, res) => {
  if (!req.Model) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }
  const filter = generateFilter(req);
  await req.Model.updateMany(
    filter,
    req.method.toLowerCase() == "put" ? req.body : { $set: req.body }
  );
  const resBody = {
    code: 200,
    message: "Updated succesfully.",
  };
  console.log(resBody);
  res.json(resBody);
};

const handleDelete = async (req, res) => {
  if (!req.Model) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }
  const filter = generateFilter(req);
  await req.Model.deleteMany(filter);
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
  await setModel(req);
  switch (req.method.toLowerCase()) {
    case "post":
      await handlePost(req, res);
      break;
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
