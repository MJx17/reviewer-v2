
const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Anonymous",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // optional if logged in
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("SupportMessage", supportMessageSchema);
