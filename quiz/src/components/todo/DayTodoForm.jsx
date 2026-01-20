// DayTodoForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function DayTodoForm({ onSubmit, date }) {
  const [input, setInput] = useState('');

  const handleChange = (e) => setInput(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit({ text: input, date }); // date is fixed
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
      <input
        type="text"
        placeholder="Add todo for this day"
        value={input}
        onChange={handleChange}
        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
      />
      <button type="submit" style={{ backgroundColor: '#8b4513', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
        Add
      </button>
    </form>
  );
}

DayTodoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
};

export default DayTodoForm;
