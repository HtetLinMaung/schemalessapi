const { Schema, model } = require("mongoose");

const scriptSchema = new Schema(
  {
    scriptType: {
      type: String,
      enum: ["inline", "file"],
      default: "",
    },
    script: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
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

module.exports = model("Script", scriptSchema);
