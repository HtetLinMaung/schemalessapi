const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(process.env.db_connection);
};
