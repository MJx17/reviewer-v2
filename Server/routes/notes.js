const express = require("express");
const Note = require("../Models/Note");
const bodyParser = require("body-parser"); // ensure we can set limits

const router = express.Router();

// Increase JSON payload size for this router (handles TinyMCE Base64 images)
router.use(bodyParser.json({ limit: "50mb" }));
router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// GET all notes (optional: filter by subjectId)
// router.get("/", async (req, res) => {
//   try {
//     const { subjectId } = req.query;
//     const filter = subjectId ? { subjectId } : {};
//     const notes = await Note.find(filter).sort({ lastModified: -1 });
//     res.json(notes);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

//with Pagination
router.get("/", async (req, res) => {
  try {
    const { subjectId, page = 1, limit = 9 } = req.query; // defaults: page 1, 9 items per page
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const filter = {};
    if (subjectId) filter.subjectId = subjectId;

    // Total count for pagination
    const total = await Note.countDocuments(filter);

    // Fetch paginated notes
    const notes = await Note.find(filter)
      .sort({ lastModified: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      notes,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET a single note by ID
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate("subjectId");
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// CREATE note
router.post("/", async (req, res) => {
  try {
    // optional: sanitize req.body.body if needed
    const note = await Note.create(req.body); 
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE note
router.put("/:id", async (req, res) => {
  try {
    await Note.findByIdAndUpdate(req.params.id, {
      ...req.body,
      lastModified: Date.now(),
    });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE note
router.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
