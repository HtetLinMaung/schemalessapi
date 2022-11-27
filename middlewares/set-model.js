const ModelDefinition = require("../models/ModelDefinition");
const connectMongoose = require("../utils/connect-mongoose");
const mongoose = require("mongoose");
const dbSchemaToSchema = require("../utils/dbSchema-to-schema");

module.exports = async (req) => {
  console.log({
    body: req.body,
    query: req.query,
    params: req.params,
    url: req.url,
    path: req.path,
    method: req.method,
    headers: req.headers,
  });
  const { model } = req.params;

  await connectMongoose();
  req.Model = mongoose.models[model];
  if (!req.Model) {
    const modelDefinition = await ModelDefinition.findOne({
      modelName: model,
    });
    if (modelDefinition) {
      const schema = new mongoose.Schema(
        dbSchemaToSchema(modelDefinition.schema),
        modelDefinition.options
      );
      for (const { fields, options } of modelDefinition.indexes) {
        schema.index(fields, options);
      }
      req.Model = mongoose.model(model, schema);
    }
  }
};
