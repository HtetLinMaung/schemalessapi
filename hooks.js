const ModelDefinition = require("./models/ModelDefinition");
const connectMongoose = require("./utils/connect-mongoose");

exports.afterMasterProcessStart = async () => {
  console.log("after master process start!");
  await connectMongoose();
  const modelDefinition = await ModelDefinition.findOne({
    modelName: "ModelDefinition",
  });
  if (!modelDefinition) {
    await ModelDefinition({
      modelName: "ModelDefinition",
      schema: {
        modelName: {
          type: "String",
          required: true,
        },
        schema: {
          type: "Schema.Types.Mixed",
          default: {},
        },
        options: {
          type: "Schema.Types.Mixed",
          default: {},
        },
        indexes: [
          {
            fields: "Schema.Types.Mixed",
            options: "Schema.Types.Mixed",
          },
        ],
      },
      options: {
        timestamps: true,
      },
      indexes: [
        {
          fields: { modelName: 1 },
          options: { unique: true },
        },
      ],
    }).save();
  }
};
