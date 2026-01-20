require("dotenv").config();
const connectDB = require("../config/db");
const Subject = require("../models/Subject");
const Flashcard = require("../models/Flashcard");
const flashcardsData = require("../data/flashcard.json"); // your sample data

const seedFlashcards = async () => {
  await connectDB();

  // Create subject if not exists
  let subject = await Subject.findOne({ name: "Math" });
  if (!subject) {
    subject = await Subject.create({ name: "Math", description: "Sample Math subject" });
    console.log("Created subject:", subject.name);
  }

  console.log("Seeding flashcards...");

  // Use for...of to properly await each create
  for (const item of flashcardsData) {
    try {
      await Flashcard.create({
        question: item.question,
        answer: item.answer,
        explanation: item.explanation || "",
        subjectId: subject._id,

        // Add defaults for required fields in case schema needs them
        state: "new",
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        lastReviewed: null,
        totalReviews: 0,
        lapses: 0,
        lastDifficulty: null,
        dueDate: new Date(),
      });
      console.log("Seeded flashcard:", item.question);
    } catch (err) {
      console.error("Failed to seed flashcard:", item.question, err.message);
    }
  }

  console.log("✅ Flashcards seeding finished!");
  process.exit(0);
};

seedFlashcards();
