const { Schema, model } = require("mongoose");

const questScriptSchema = new Schema(
  {
    quest: {
      type: Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
    },
    script: {
      type: Schema.Types.ObjectId,
      ref: "Script",
      required: true,
    },
    stage: {
      type: Number,
      required: true,
    },
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

questScriptSchema.index(
  {
    quest: 1,
    stage: 1,
  },
  { unique: true }
);

module.exports = model("QuestScriptPivot", questScriptSchema);
