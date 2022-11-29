const { Schema, model } = require("mongoose");

const recordHistorySchema = new Schema(
  {
    recordInfo: {
      type: Schema.Types.ObjectId,
      ref: "RecordInfo",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    old: {
      type: Schema.Types.Mixed,
      required: true,
    },
    new: {
      type: Schema.Types.Mixed,
      default: null,
    },
    action: {
      type: String,
      enum: ["update", "delete"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("RecordHistory", recordHistorySchema);
