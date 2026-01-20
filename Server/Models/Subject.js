const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,   // prevents duplicate subject names
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model("Subject", SubjectSchema);
