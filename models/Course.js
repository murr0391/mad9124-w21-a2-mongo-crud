const Student = require("./Student");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  code: { type: String, maxlength: 16, required: true },
  title: { type: String, maxlength: 255, required: true },
  description: { type: String, maxlength: 2048, required: false },
  url: { type: String, maxlength: 512, required: false },
  students: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    required: false,
  },
});
const Model = mongoose.model("Course", schema);

module.exports = Model;
