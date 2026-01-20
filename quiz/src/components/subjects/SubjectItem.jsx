import { FaEdit, FaTrash } from "react-icons/fa";


export default function SubjectItem({ subject, onEdit, onDelete }) {
  return (
    <li className="subject-item">
      <span className="subject-name">{subject.name}</span>
      <div className="subject-actions">
        <button
          className="subject-action-btn edit"
          onClick={() => onEdit(subject)}
          aria-label="Edit subject"
        >
          <FaEdit className="subject-action-icon" />
          <span className="subject-action-text">Edit</span>
        </button>
        <button
          className="subject-action-btn delete"
          onClick={() => onDelete(subject._id)}
          aria-label="Delete subject"
        >
          <FaTrash className="subject-action-icon" />
          <span className="subject-action-text">Delete</span>
        </button>
      </div>
    </li>
  );
}
