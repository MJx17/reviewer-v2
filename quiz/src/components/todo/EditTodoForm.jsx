import React, { useState } from 'react';
import PropTypes from 'prop-types';

function EditTodoForm({ onSubmit, todo }) {
  const [input, setInput] = useState(todo.text);

  const handleChange = (e) => setInput(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Send a single object containing _id and updated text
    onSubmit({ _id: todo._id, text: input });
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Update your todo"
        value={input}
        className="todo-input"
        onChange={handleChange}
      />
      <button className="todo-button" type="submit">Update</button>
    </form>
  );
}

EditTodoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  todo: PropTypes.object.isRequired
};

export default EditTodoForm;
