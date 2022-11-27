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

  return [schemaBody, dbSchemaBody];
};

module.exports = jsonToSchema;
