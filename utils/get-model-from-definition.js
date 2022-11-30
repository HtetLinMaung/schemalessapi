const mongoose = require("mongoose");
const ModelDefinition = require("../models/ModelDefinition");
const dbSchemaToSchema = require("./dbSchema-to-schema");

module.exports = async (modelName) => {
  let Model = mongoose.models[modelName];
  if (Model) {
    return Model;
  }

  const modelDefinition = await ModelDefinition.findOne({
    modelName: modelName,
  });
  if (!modelDefinition) {
    throw new Error("Model Definition not found!");
  }
  const schema = new mongoose.Schema(
    dbSchemaToSchema(modelDefinition.schema),
    modelDefinition.options
  );
  for (const { fields, options } of modelDefinition.indexes) {
    schema.index(fields, options);
  }
  return mongoose.model(modelName, schema);
};
