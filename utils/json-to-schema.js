const { Schema } = require("mongoose");
const getModelFromDefinition = require("./get-model-from-definition");
const {
  getMongooseType,
  getMongooseTypeToString,
} = require("./get-mongoose-type");

const jsonToSchema = async (json) => {
  let schemaBody = {};
  let dbSchemaBody = {};

  for (const [k, v] of Object.entries(json)) {
    if (typeof v == "object") {
      const [subSchemaBody, subDbSchemaBody] = await jsonToSchema(v);
      schemaBody[k] = subSchemaBody;
      dbSchemaBody[k] = subDbSchemaBody;
      if ("ref" in v) {
        await getModelFromDefinition(v.ref);
      }
    } else {
      schemaBody[k] = {
        type: getMongooseType(v),
        default: null,
      };
      dbSchemaBody[k] = {
        type: getMongooseTypeToString(v),
        default: null,
      };
    }
  }

  if (process.env.authentication_logic == "on") {
    schemaBody["_user"] = {
      type: Schema.Types.ObjectId,
      ref: "User",
    };
    dbSchemaBody["_user"] = {
      type: "Schema.Types.ObjectId",
      ref: "User",
    };
  }

  return [schemaBody, dbSchemaBody];
};

module.exports = jsonToSchema;
