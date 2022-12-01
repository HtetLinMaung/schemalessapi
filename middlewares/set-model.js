const connectMongoose = require("../utils/connect-mongoose");
const getModelFromDefinition = require("../utils/get-model-from-definition");

module.exports = async (req) => {
  console.log({
    body: req.body,
    query: req.query,
    params: req.params,
    url: req.url,
    path: req.path,
    method: req.method,
    headers: req.headers,
  });
  const { model } = req.params;

  await connectMongoose();
  req.Model = await getModelFromDefinition(model);
};
