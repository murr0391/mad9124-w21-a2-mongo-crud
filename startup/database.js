const debug = require("debug")("cListR:db");
const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect(`mongodb://localhost:27017/mad9124`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      debug(`Connected to MongoDB ...`);
    })
    .catch((err) => {
      debug(`Error connecting to MongoDB ...`, err.message);
      process.exit(1);
    });
};
