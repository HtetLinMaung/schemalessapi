const getModelFromDefinition = require("./get-model-from-definition");

const prefixData = (str, minLength = 1, chr = "0") => {
  if (typeof str != "string") {
    str = str + "";
  }
  while (str.length < minLength) {
    str = chr + str;
  }
  return str;
};

module.exports = async (modelName, body = {}) => {
  const SequenceColumn = await getModelFromDefinition("SequenceColumn");
  const Sequence = await getModelFromDefinition("Sequence");
  const SequenceCount = await getModelFromDefinition("SequenceCount");
  Sequence;

  const sequenceColumns = await SequenceColumn.find(
    {
      modelName,
      columnName: {
        $in: Object.keys(body),
      },
    },
    { columnName: 1, sequence: 1 }
  )
    .sort({ modelName: 1, columnName: 1 })
    .populate("sequence");
  for (const { columnName, sequence } of sequenceColumns) {
    if (columnName in body) {
      const sequenceCount = await SequenceCount.findOneAndUpdate(
        {
          sequence: sequence._id,
          match: body[columnName],
        },
        {
          $inc: {
            count: sequence.step,
          },
        }
      );

      body[columnName] = sequence.format
        .replaceAll(
          "{count}",
          prefixData(
            sequenceCount.count,
            sequence.minDigitLength,
            sequence.prefixChar
          )
        )
        .replaceAll("{match}", body[columnName]);
    }
  }
};
