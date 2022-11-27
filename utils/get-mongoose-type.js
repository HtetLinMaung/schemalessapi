const { Schema } = require("mongoose");

const getMongooseType = (v) => {
  if (typeof v == "string") {
    return String;
  } else if (typeof v == "number") {
    return Number;
  } else if (typeof v == "boolean") {
    return Boolean;
  } else if (Array.isArray(v)) {
    if (v.length && [...new Set(v.map((item) => typeof item))].length == 1) {
      return getMongooseType(v[0]);
    } else {
      return [Schema.Types.Mixed];
    }
  } else {
    return Schema.Types.Mixed;
  }
};

const getMongooseTypeToString = (v) => {
  if (typeof v == "string") {
    return "String";
  } else if (typeof v == "number") {
    return "Number";
  } else if (typeof v == "boolean") {
    return "Boolean";
  } else if (Array.isArray(v)) {
    if (v.length && [...new Set(v.map((item) => typeof item))].length == 1) {
      return getMongooseTypeToString(v[0]);
    } else {
      return ["Schema.Types.Mixed"];
    }
  } else {
    return "Schema.Types.Mixed";
  }
};

exports.getMongooseTypeToString = getMongooseTypeToString;
exports.getMongooseType = getMongooseType;
