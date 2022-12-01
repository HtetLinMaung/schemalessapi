const { Schema } = require("mongoose");

Schema;
const dbSchemaToSchema = (json) => {
  const schemaBody = {};
  for (const [k, v] of Object.entries(json)) {
    if (Array.isArray(v)) {
      if (typeof v[0] == "object") {
        if ("type" in v[0]) {
          v[0].type = eval(v[0].type);
        } else {
          v[0] = dbSchemaToSchema(v[0]);
        }
        schemaBody[k] = v;
      } else {
        schemaBody[k] = eval(v);
      }
    } else if (typeof v == "object") {
      if ("type" in v) {
        v.type = eval(v.type);
        schemaBody[k] = v;
      } else {
        schemaBody[k] = dbSchemaToSchema(v);
      }
    } else {
      schemaBody[k] = eval(v);
    }
  }
  return schemaBody;
};

module.exports = dbSchemaToSchema;
