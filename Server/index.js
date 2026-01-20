require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");
const notesRoutes = require("./routes/notes");
const todosRoutes = require("./routes/todos");
const subjectRoutes = require("./routes/subject");
const flashcardRoutes = require("./routes/flashcards");
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/password");



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

// Routes
app.use("/notes", notesRoutes);
app.use("/todos", todosRoutes);
app.use("/subjects", subjectRoutes);
app.use("/flashcards", flashcardRoutes);
app.use("/auth", authRoutes);
app.use("/password", passwordRoutes);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
