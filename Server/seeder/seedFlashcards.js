// require("dotenv").config();
// const path = require("path");
// const connectDB = require("../config/db");
// const Subject = require("../models/Subject");
// const Flashcard = require("../models/Flashcard");


// const subjects = {
//   "clinical chemistry": "ClinicalChemistry.json",
//   "clinical microscopy": "ClinicalMicroscopy.json",
//   ibss: "IBSS.json",
//   hematology: "Hematology.json",
//   "medtech laws": "MedtechLaws.json",
//   microbiology: "Microbiology.json",
// };

// const seedFlashcards = async () => {
//   await connectDB();
//   console.log("🌱 Connected to database");

//   for (const [subjectName, fileName] of Object.entries(subjects)) {
//     console.log(`\n📘 Processing subject: ${subjectName}`);

//     // 1. Find or create subject
//     let subject = await Subject.findOne({ name: subjectName });
//     if (!subject) {
//       subject = await Subject.create({
//         name: subjectName,
//         description: `${subjectName} flashcards`,
//       });
//       console.log(`✅ Created subject: ${subjectName}`);
//     }

//     // 2. Load flashcard JSON file
//     const filePath = path.join(__dirname, "../data", fileName);
//     const flashcardsData = require(filePath);

//     // 3. Seed flashcards
//     for (const item of flashcardsData) {
//       try {
//         await Flashcard.create({
//           question: item.question,
//           answer: item.answer,
//           explanation: item.explanation || "",
//           subjectId: subject._id,

//           // SM-2 defaults
//           state: "new",
//           easeFactor: 2.5,
//           interval: 0,
//           repetitions: 0,
//           lastReviewed: null,
//           totalReviews: 0,
//           lapses: 0,
//           lastDifficulty: null,
//           dueDate: new Date(),
//         });

//         console.log(`✔ Seeded: ${item.question.slice(0, 50)}...`);
//       } catch (err) {
//         console.error(
//           `❌ Failed: ${item.question?.slice(0, 50)}...`,
//           err.message
//         );
//       }
//     }
//   }

//   console.log("\n🎉 All flashcards seeded successfully!");
//   process.exit(0);
// };

// seedFlashcards();
