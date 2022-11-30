const ModelDefinition = require("./models/ModelDefinition");
const connectMongoose = require("./utils/connect-mongoose");

exports.afterMasterProcessStart = async () => {
  console.log("after master process start!");
  await connectMongoose();
  let modelDefinition = await ModelDefinition.findOne({
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

  modelDefinition = await ModelDefinition.findOne({
    modelName: "Quest",
  });
  if (!modelDefinition) {
    await ModelDefinition({
      modelName: "Quest",
      schema: {
        title: {
          type: "String",
          required: true,
        },
        description: {
          type: "String",
          required: true,
        },
        url: {
          type: "String",
          required: true,
        },
        method: {
          type: "String",
          enum: ["get", "post", "put", "patch", "delete"],
          default: "get",
        },
      },
      options: {
        timestamps: true,
      },
      indexes: [
        {
          fields: { url: 1, method: 1 },
          options: { unique: true },
        },
      ],
    }).save();
  }

  modelDefinition = await ModelDefinition.findOne({
    modelName: "Script",
  });
  if (!modelDefinition) {
    await ModelDefinition({
      modelName: "Script",
      schema: {
        scriptType: {
          type: "String",
          enum: ["inline", "file"],
          default: "",
        },
        script: {
          type: "String",
          required: true,
        },
      },
      options: {
        timestamps: true,
      },
      indexes: [],
    }).save();
  }

  modelDefinition = await ModelDefinition.findOne({
    modelName: "QuestScriptPivot",
  });
  if (!modelDefinition) {
    await ModelDefinition({
      modelName: "QuestScriptPivot",
      schema: {
        quest: {
          type: "Schema.Types.ObjectId",
          ref: "Quest",
          required: true,
        },
        script: {
          type: "Schema.Types.ObjectId",
          ref: "Script",
          required: true,
        },
        stage: {
          type: "Number",
          required: true,
        },
      },
      options: {
        timestamps: true,
      },
      indexes: [
        {
          fields: { quest: 1, stage: 1 },
          options: { unique: true },
        },
      ],
    }).save();
  }
};
