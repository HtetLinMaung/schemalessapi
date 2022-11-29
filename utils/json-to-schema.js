const { Schema } = require("mongoose");
const {
  getMongooseType,
  getMongooseTypeToString,
} = require("./get-mongoose-type");

const jsonToSchema = (json) => {
  let schemaBody = {};
  let dbSchemaBody = {};

  for (const [k, v] of Object.entries(json)) {
    if (typeof v == "object") {
      const [subSchemaBody, subDbSchemaBody] = jsonToSchema(v);
      schemaBody[k] = subSchemaBody;
      dbSchemaBody[k] = subDbSchemaBody;
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
