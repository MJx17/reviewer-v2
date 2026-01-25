require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const notesRoutes = require("./routes/notes");
const todosRoutes = require("./routes/todos");
const subjectRoutes = require("./routes/subject");
const flashcardRoutes = require("./routes/flashcards");
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/password");
const pushRoutes = require("./routes/push");
const supportRoutes = require("./routes/support");
const cron = require("node-cron");
const { sendDailyReminder } = require("./controllers/notificationController");

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect DB
connectDB();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Reviewer API is up and running 🚀" });
});

// Routes
app.use("/notes", notesRoutes);
app.use("/todos", todosRoutes);
app.use("/subjects", subjectRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/auth", authRoutes);
app.use("/password", passwordRoutes);
app.use("/push", pushRoutes);
app.use("/support", supportRoutes);

app.post("/send-daily-reminder", async (req, res) => {
  try {
    await sendDailyReminder(); // call your async function
    res.json({ message: "Daily reminder triggered." });
  } catch (err) {
    console.error("Daily reminder error:", err);
    res.status(500).json({ error: "Failed to send daily reminder" });
  }
});

const CRON_TZ = "Asia/Manila";

// Only run cron in dev or a persistent server
if (process.env.NODE_ENV !== "production") {
  cron.schedule(
    "0 8 * * *",
    async () => {
      console.log("Running daily 8 AM reminder...");
      await sendDailyReminder();
    },
    { timezone: CRON_TZ }
  );

  cron.schedule(
    "0 8,14,20 * * *",
    async () => {
      console.log("Running 6-hour interval reminder...");
      await sendDailyReminder();
    },
    { timezone: CRON_TZ }
  );
}

// 🔥 TEST CRON (runs regardless of env)
cron.schedule(
  "57 11 * * *",
  async () => {
    console.log("🔥 TEST CRON fired at:", new Date().toLocaleString("en-PH"));
    await sendDailyReminder();
  },
  { timezone: CRON_TZ }
);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
