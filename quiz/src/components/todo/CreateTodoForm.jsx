import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CreateTodoForm({ onSubmit, defaultDate }) {
  const [input, setInput] = useState('');
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0]);

  const handleChange = (e) => setInput(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit({ text: input, date });
    setInput('');
    setDate(defaultDate || new Date().toISOString().split('T')[0]);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new todo"
        value={input}
        className="todo-input"
        onChange={handleChange}
      />
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="todo-date"
      />
      <button className="todo-button" type="submit">Add todo</button>
    </form>
  );
}

CreateTodoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  defaultDate: PropTypes.string
};

export default CreateTodoForm;
