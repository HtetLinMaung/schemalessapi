const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "inactive",
      enum: ["inactive", "lock", "active", "suspend"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: 1 }, { unique: true });

module.exports = model("User", userSchema);
