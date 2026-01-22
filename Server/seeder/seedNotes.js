require("dotenv").config();
const path = require("path");
const connectDB = require("../config/db");
const Subject = require("../Models/Subject");
const Note = require("../Models/Note");

// Map subjects to their JSON files
const subjects = {
  "clinical chemistry": "ClinicalChemistry.json",
  "clinical microscopy": "ClinicalMicroscopy.json",
  ibss: "IBSS.json",
  hematology: "Hematology.json",
  "medtech laws": "MedtechLaws.json",
  microbiology: "Microbiology.json",
};

const seedNotes = async () => {
  await connectDB();
  console.log("🌱 Connected to database");

  for (const [subjectName, fileName] of Object.entries(subjects)) {
    console.log(`\n📘 Processing subject: ${subjectName}`);

    // 1️⃣ Find or create subject
    let subject = await Subject.findOne({ name: subjectName });
    if (!subject) {
      subject = await Subject.create({
        name: subjectName,
        description: `${subjectName} notes`,
      });
      console.log(`✅ Created subject: ${subjectName}`);
    }

    // 2️⃣ Load notes JSON file
    const filePath = path.join(__dirname, "../notes-data", fileName);
    const notesData = require(filePath);

    // 3️⃣ Seed notes
    for (const item of notesData) {
      try {
        await Note.create({
          id: item.id, // optional mapping id
          title: item.title,
          body: item.body,
          subjectId: subject._id,
          // status defaults to "active" from schema
          lastModified: Date.now(),
        });

        console.log(`✔ Seeded note: ${item.title.slice(0, 50)}...`);
      } catch (err) {
        console.error(
          `❌ Failed to seed note: ${item.title?.slice(0, 50)}...`,
          err.message
        );
      }
    }
  }

  console.log("\n🎉 All notes seeded successfully!");
  process.exit(0);
};

seedNotes();
