import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppModal from "../components/ui/modal";
import { BiEdit, BiTrash } from "react-icons/bi";
import DayTodoForm from '../components/todo/DayTodoForm';
import EditTodoForm from '../components/todo/EditTodoForm';
import '.././styles/todo.css';
import Loading from "../components/ui/loading";
import { getTodos, createTodo, updateTodo, deleteTodo, toggleCompleteTodo } from "../services/todoService";

const DayTodosPage = () => {
    const { date } = useParams(); // "YYYY-MM-DD"
    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    const [adding, setAdding] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTodosForDate();
    }, [date]);

    const fetchTodosForDate = async () => {
        setLoading(true);
        try {
            const data = await getTodos({ date });
            setTodos(data);
        } catch (err) {
            toast.error("Failed to fetch todos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const handleAddTodo = async (todo) => {
        setLoading(true);
        try {
            const data = await createTodo({ ...todo, date });
            setTodos([...todos, data]);
            toast.success("Todo added!");
            setAdding(false);
        } catch (err) {
            toast.error("Failed to add todo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTodo = async (updatedTodo) => {
        setLoading(true);
        try {
            const data = await updateTodo(updatedTodo._id, updatedTodo);
            setTodos(todos.map((t) => (t._id === updatedTodo._id ? data : t)));
            toast.success("Todo updated!");
            setEditingTodo(null);
        } catch (err) {
            toast.error("Failed to update todo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTodo = async (id) => {
        setLoading(true);
        try {
            await deleteTodo(id);
            setTodos(todos.filter((t) => t._id !== id));
            toast.info("Todo deleted.");
        } catch (err) {
            toast.error("Failed to delete todo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComplete = async (id) => {
        setLoading(true);
        try {
            const data = await toggleCompleteTodo(id);
            setTodos(todos.map((t) => (t._id === id ? data : t)));
        } catch (err) {
            toast.error("Failed to update todo status.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = async (e) => {
        setLoading(true);
        try {
            const selectAll = e.target.checked;
            const updatedTodos = await Promise.all(
                todos.map(async (t) => {
                    if (t.isComplete !== selectAll) {
                        const data = await toggleCompleteTodo(t._id);
                        return data;
                    }
                    return t;
                })
            );
            setTodos(updatedTodos);
        } catch (err) {
            toast.error("Failed to update todos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const completedCount = todos.filter(t => t.isComplete).length;
    const allTodosCompleted = todos.length > 0 && todos.every(t => t.isComplete);

    return (
        <div className="day-todos-page">
            {loading && <Loading />}
            <h1>Todos for {new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</h1>

            {todos.length > 0 && (
                <p className={`todo-summary ${allTodosCompleted ? 'all-completed' : ''}`}>
                    {completedCount}/{todos.length} complete
                </p>
            )}

            <div className="page-controls">
                <button onClick={() => setAdding(true)}>+ Add Todo</button>
                <button onClick={() => navigate('/todos')}>Back to Month View</button>
            </div>

            {todos.length > 0 && (
                <label className="select-all">
                    <input
                        type="checkbox"
                        checked={completedCount === todos.length}
                        onChange={handleSelectAll}
                    />
                    <span>Select All</span>
                </label>
            )}

            {/* Add Todo Modal */}
            <AppModal
                isOpen={adding}
                onClose={() => setAdding(false)}
                title={`Add Task`}
                maxWidth="600px"
            >
                <DayTodoForm
                    defaultDate={date}
                    onSubmit={handleAddTodo}
                />
            </AppModal>

            {/* Edit Todo Modal */}
            {editingTodo && (
                <AppModal
                    isOpen={!!editingTodo}
                    onClose={() => setEditingTodo(null)}
                    title="Edit Task"
                    maxWidth="600px"
                >
                    <EditTodoForm
                        todo={editingTodo}
                        onSubmit={handleEditTodo}
                    />
                </AppModal>
            )}

            <ul className="todos-list">
                {todos.length > 0 ? todos.map(t => (
                    <li key={t._id} className={`todo-item ${t.isComplete ? 'completed' : ''}`}>
                        <label className="todo-label">
                            <input
                                type="checkbox"
                                checked={t.isComplete}
                                onChange={() => handleToggleComplete(t._id)}
                            />
                            <span className={`todo-text ${t.isComplete ? 'completed' : ''}`}>{t.text}</span>
                        </label>
                        <div className="todo-actions">
                            <button
                                className="todo-action-btn edit"
                                onClick={() => setEditingTodo(t)}
                                aria-label="Edit todo"
                            >
                                <BiEdit className="todo-action-icon" />
                                <span className="todo-action-text">Edit</span>
                            </button>

                            <button
                                className="todo-action-btn delete"
                                onClick={() => handleDeleteTodo(t._id)}
                                aria-label="Delete todo"
                            >
                                <BiTrash className="todo-action-icon" />
                                <span className="todo-action-text">Delete</span>
                            </button>
                        </div>
                    </li>
                )) : <p>No todos for this day.</p>}
            </ul>
        </div>
    );
};

export default DayTodosPage;
