const { Schema, model } = require("mongoose");

const recordInfoSchema = new Schema(
  {
    modelDefinition: {
      type: Schema.Types.ObjectId,
      ref: "ModelDefinition",
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authority: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("RecordInfo", recordInfoSchema);
