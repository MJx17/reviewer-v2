const mongoose = require("mongoose");

const FlashcardSchema = new mongoose.Schema(
  {
    // ===== Core Content =====
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    // ===== Relations =====
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    // ===== Learning State =====
    state: {
      type: String,
      enum: ["new", "review", "relearning", "mastered"],
      default: "new",
    },
    // ===== SM-2 Fields =====
    easeFactor: {
      type: Number,
      default: 2.5,
      min: 1.3,
    },

    interval: {
      type: Number,
      default: 0, // days
    },

    repetitions: {
      type: Number,
      default: 0,
    },

    dueDate: {
      type: Date,
      default: () => new Date(), // FIXED
    },

    lastReviewed: {
      type: Date,
      default: null,
    },

    // ===== Stats =====
    totalReviews: {
      type: Number,
      default: 0,
    },

    lapses: {
      type: Number,
      default: 0,
    },
    // ===== Last review difficulty =====
    lastDifficulty: {
      type: String,
      enum: ["easy", "good", "hard"],
      default: null,
    },

  },
  {
    timestamps: true, // auto createdAt + updatedAt
  }
);

module.exports = mongoose.model("Flashcard", FlashcardSchema);
