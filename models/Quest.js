const { Schema, model } = require("mongoose");

const questSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      enum: ["get", "post", "put", "patch", "delete"],
      default: "get",
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

questSchema.index(
  {
    url: 1,
    method: 1,
  },
  { unique: true }
);

module.exports = model("Quest", questSchema);
