

// models/todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isComplete: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }, // Track the day for the todo
});


const Todo = mongoose.model('todos', todoSchema);

module.exports = Todo;


