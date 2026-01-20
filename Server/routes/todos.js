const express = require("express");
const Todo = require("../Models/Todo");

const router = express.Router();


router.get("/", async (req, res) => {
  const { date, month } = req.query;
  try {
    let todos;
    if (date) {
      todos = await Todo.find({ date });
    } else if (month) {
      // month = "YYYY-MM"
      const start = new Date(`${month}-01`);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      todos = await Todo.find({
        date: { $gte: start.toISOString().split('T')[0], $lte: end.toISOString().split('T')[0] }
      });
    } else {
      todos = await Todo.find();
    }
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});


// Add todo
router.post("/", async (req, res) => {
  try {
    const { text, date } = req.body;
    const todoDate = date ? new Date(date) : new Date();
    const todo = await Todo.create({ text, date: todoDate });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const todos = req.body.map(t => ({
      text: t.text,
      date: new Date(t.date)
    }));

    const created = await Todo.insertMany(todos);
    res.json(created);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todos" });
  }
});

// Update todo
router.put("/:id", async (req, res) => {
  try {
    const { text, date } = req.body;
    const todoDate = date ? new Date(date) : undefined;
    const updateData = { text };
    if (todoDate) updateData.date = todoDate;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Toggle complete
router.put("/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    todo.isComplete = !todo.isComplete;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle complete" });
  }
});

// Delete todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

module.exports = router;
