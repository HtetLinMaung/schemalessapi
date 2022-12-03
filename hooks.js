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
        _user: {
          type: "Schema.Types.ObjectId",
          ref: "User",
          default: null,
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
        name: {
          type: "String",
          required: true,
          unique: true,
        },
        description: {
          type: "String",
          default: "",
        },
        scriptType: {
          type: "String",
          enum: ["inline", "file"],
          default: "",
        },
        script: {
          type: "String",
          required: true,
        },
        _user: {
          type: "Schema.Types.ObjectId",
          ref: "User",
          default: null,
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
        _user: {
          type: "Schema.Types.ObjectId",
          ref: "User",
          default: null,
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

  modelDefinition = await ModelDefinition.findOne({
    modelName: "Sequence",
  });
  if (!modelDefinition) {
    await ModelDefinition({
      modelName: "Sequence",
      schema: {
        name: {
          type: "String",
          required: true,
        },
        format: {
          type: "String",
          default: "{match}{count}",
        },
        prefixChar: {
          type: "String",
          default: "0",
        },
        minDigitLength: {
          type: "Number",
          default: 1,
        },
        step: {
          type: "Number",
          default: 1,
        },
        start: {
          type: "Number",
          default: 1,
        },
        _user: {
          type: "Schema.Types.ObjectId",
          ref: "User",
          default: null,
        },
      },
      options: {
        timestamps: true,
      },
      indexes: [],
    }).save();
  }

  modelDefinition = await ModelDefinition.findOne({
    modelName: "SequenceColumn",
  });
  if (!modelDefinition) {
    await ModelDefinition({
      modelName: "SequenceColumn",
      schema: {
        modelName: {
          type: "String",
          required: true,
        },
        columnName: {
          type: "String",
          required: true,
        },
        sequence: {
          type: "Schema.Types.ObjectId",
          ref: "Sequence",
          required: true,
        },
        _user: {
          type: "Schema.Types.ObjectId",
          ref: "User",
          default: null,
        },
      },
      options: {
        timestamps: true,
      },
      indexes: [
        {
          fields: { modelName: 1, columnName: 1, sequence: 1 },
          options: { unique: true },
        },
      ],
    }).save();
  }

  modelDefinition = await ModelDefinition.findOne({
    modelName: "SequenceCount",
  });
  if (!modelDefinition) {
    await ModelDefinition({
      modelName: "SequenceCount",
      schema: {
        sequence: {
          type: "Schema.Types.ObjectId",
          ref: "Sequence",
          required: true,
        },
        match: {
          type: "String",
          required: true,
        },
        count: {
          type: "Number",
          default: 1,
        },
        _user: {
          type: "Schema.Types.ObjectId",
          ref: "User",
          default: null,
        },
      },
      options: {
        timestamps: true,
      },
      indexes: [
        {
          fields: { sequence: 1, match: 1 },
          options: { unique: true },
        },
      ],
    }).save();
  }
};
