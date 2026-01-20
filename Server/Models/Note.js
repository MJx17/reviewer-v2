const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Untitled Note",
  },
  body: {
    type: String,
    default: "",
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to Subject collection
    ref: "Subject",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "archived", "learning", "completed", "review"], // extended statuses
    default: "active",
  },
  lastModified: {
    type: Number,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", NoteSchema);
