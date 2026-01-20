import { useNavigate } from 'react-router-dom';
import { FaFileSignature } from "react-icons/fa6";
import '../../styles/todo.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MonthView = ({ todos, selectedMonth, selectedYear }) => {
  const navigate = useNavigate();

  // Filter todos for the selected month/year
  const todosThisMonth = todos.filter(todo => {
    const todoDate = new Date(todo.date);
    return todoDate.getFullYear() === selectedYear && todoDate.getMonth() === selectedMonth;
  });

  // Group todos by day
  const todosByDay = {};
  todosThisMonth.forEach(t => {
    const day = new Date(t.date).getDate();
    if (!todosByDay[day]) todosByDay[day] = [];
    todosByDay[day].push(t);
  });

  const daysWithTodos = Object.keys(todosByDay).sort((a, b) => a - b);

  const handleDayClick = (day) => {
    const monthStr = String(selectedMonth + 1).padStart(2, '0');
    navigate(`/todos/${selectedYear}-${monthStr}-${String(day).padStart(2, '0')}`);
  };

  if (daysWithTodos.length === 0) {
    return <p className="no-todos">No todos for this month.</p>;
  }

  return (
    <div className="month-view">
      {daysWithTodos.map(day => {
        const monthName = MONTH_NAMES[selectedMonth];
        return (
          <div
            key={day}
            className="day-box has-todo"
            onClick={() => handleDayClick(day)}
          >
            <FaFileSignature className="day-icon" />
            <span className="day-text">{monthName} {day}</span>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
