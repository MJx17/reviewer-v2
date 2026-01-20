const express = require("express");
const router = express.Router();
const Flashcard = require("../Models/FlashCard"); // adjust path if needed

// ========================
// GET all flashcards (optionally by subject)
// ========================
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.subjectId) filter.subjectId = req.query.subjectId;
    if (req.query.state) filter.state = req.query.state; // backend filters state

    const flashcards = await Flashcard.find(filter).sort({ dueDate: 1 });
    res.json(flashcards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ========================
// GET due flashcards by subject
// ========================
router.get("/due/:subjectId", async (req, res) => {
  try {
    const dueCards = await Flashcard.find({
      subjectId: req.params.subjectId,
      dueDate: { $lte: new Date() },
    }).sort({ dueDate: 1 });

    res.json(dueCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// GET single flashcard
// ========================
router.get("/:id", async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    if (!flashcard) return res.status(404).json({ error: "Not found" });
    res.json(flashcard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// CREATE new flashcard
// ========================
router.post("/", async (req, res) => {
  try {
    const { question, answer, explanation, subjectId } = req.body;

    const flashcard = await Flashcard.create({
      question,
      answer,
      explanation: explanation || "",
      subjectId,

      // ===== Initialize review tracking =====
      state: "new",           // default learning state
      easeFactor: 2.5,        // default SM-2 ease factor
      interval: 0,            // next review interval
      repetitions: 0,         // number of consecutive correct answers
      lastReviewed: null,     // last review timestamp
      lastDifficulty: null,   // semantic last difficulty (hard/good/easy)
      dueDate: new Date(),    // first due date is today
      totalReviews: 0,
      lapses: 0,
    });

    res.status(201).json(flashcard);
  } catch (err) {
    console.error("Create flashcard error:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Invalid flashcard data",
        details: err.message,
      });
    }
    res.status(500).json({ error: "Failed to create flashcard" });
  }
});


// ========================
// UPDATE flashcard (whitelist fields)
// ========================
router.put("/:id", async (req, res) => {
  try {
    const { question, answer, explanation, subjectId } = req.body;
    const flashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { question, answer, explanation, subjectId },
      { new: true, runValidators: true }
    );

    if (!flashcard) return res.status(404).json({ error: "Not found" });
    res.json(flashcard);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ========================
// DELETE flashcard
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const flashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!flashcard) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================
// REVIEW flashcard (SM-2 algorithm with capped interval)
// ========================
router.post("/:id/review", async (req, res) => {
  try {
    const { grade } = req.body; // 1 = hard/fail, 3 = good, 5 = easy
    const card = await Flashcard.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });

    const now = new Date();
    const MIN_EF = 1.3;
    const MAX_INTERVAL = 90;

    const difficultyMap = { 1: "hard", 3: "good", 5: "easy" };
    const difficulty = difficultyMap[grade];
    if (!difficulty) return res.status(400).json({ error: "Invalid grade" });

    // Common stats
    card.totalReviews += 1;
    card.lastReviewed = now;
    card.lastDifficulty = difficulty;

    if (grade < 3) {
      // HARD / AGAIN
      card.lapses += 1;
      card.repetitions = 0;
      card.interval = 1;
      card.easeFactor = Math.max(MIN_EF, card.easeFactor - 0.2);
      card.state = "relearning";
    } else {
      // SUCCESS (GOOD / EASY)
      card.repetitions += 1;

      // Set interval based on repetitions
      if (card.repetitions === 1) card.interval = grade === 5 ? 2 : 1;
      else if (card.repetitions === 2) card.interval = 6;
      else card.interval = Math.round(card.interval * card.easeFactor * (grade === 5 ? 1.3 : 1));

      // Update ease factor
      if (grade === 3) card.easeFactor = Math.max(MIN_EF, card.easeFactor + 0.05);
      else if (grade === 5) card.easeFactor = Math.max(MIN_EF, card.easeFactor + 0.15);

      // Cap interval
      if (card.interval > MAX_INTERVAL) card.interval = MAX_INTERVAL;

      // Set state
      card.state = card.interval >= MAX_INTERVAL ? "mastered" : "review";
    }

    // Update due date
    card.dueDate = new Date(now.getTime() + card.interval * 86400000); // interval in ms

    await card.save();
    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
