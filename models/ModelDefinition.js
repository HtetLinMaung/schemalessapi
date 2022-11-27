const { Schema, model } = require("mongoose");

const modelDefinitionSchema = new Schema(
  {
    modelName: {
      type: String,
      required: true,
    },
    schema: {
      type: Schema.Types.Mixed,
      default: {},
    },
    options: {
      type: Schema.Types.Mixed,
      default: {},
    },
    indexes: [
      {
        fields: Schema.Types.Mixed,
        options: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

modelDefinitionSchema.index({ modelName: 1 }, { unique: true });

module.exports = model("ModelDefinition", modelDefinitionSchema);
