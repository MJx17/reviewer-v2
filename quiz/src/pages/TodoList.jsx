import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';

import '../styles/ToDoList.css';
import MonthView from '../components/todo/MonthView';
import CreateTodoForm from '../components/todo/CreateTodoForm';
import AppModal from "../components/ui/modal";

import { getTodos, createTodo, } from "../services/todoService";

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function TodoList() {
  const today = new Date();
  const currentYear = today.getFullYear();

  const [todos, setTodos] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      toast.error("Failed to fetch todos.");
      console.error(err);
    }
  };

  const handleAddTodo = async (todo) => {
    try {
      const data = await createTodo(todo);
      setTodos([...todos, data]);
      toast.success("Todo added!");
      setShowCreateModal(false);
    } catch (err) {
      toast.error("Failed to add todo.");
      console.error(err);
    }
  };

  const handleMonthChange = (e) => setSelectedMonth(parseInt(e.target.value));
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const filteredTodos = todos.filter(t => {
    const dateObj = new Date(t.date);
    return dateObj.getMonth() === selectedMonth
      && dateObj.getFullYear() === selectedYear
      && t.text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="todo-app modern">

      {/* Header */}
      <div className="header-row">
        <h1 className="h1-todo">To Do List</h1>
        <button
          className="add-todo-button add-inline"
          onClick={() => setShowCreateModal(true)}
        >
          + Add Todo
        </button>
      </div>

      {/* Controls */}
      <div className="controls">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search todos..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-bar"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>

        <div className="selectors">
          <label>Month:</label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>

          <label>Year:</label>
          <select value={selectedYear} onChange={handleYearChange}>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MonthView */}
      <MonthView
        todos={filteredTodos}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {/* Create Todo Modal */}
      <AppModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Task"
        maxWidth="600px"
      >
        <CreateTodoForm
          onSubmit={handleAddTodo}
        />
      </AppModal>
    </div>
  );
}

export default TodoList;
