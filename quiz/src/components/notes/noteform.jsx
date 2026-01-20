import { useState, useEffect } from "react";
import TinyMCEEditor  from "../ui/TinyMCEEditor";

const STATUS_OPTIONS = ["active", "archived", "learning", "completed", "review"];

export default function NoteForm({ note, subjects, onSubmit, onCancel }) {
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");
  const [subjectId, setSubjectId] = useState(note?.subjectId || "");
  const [status, setStatus] = useState(note?.status || "active");

  useEffect(() => {
    if (!subjectId && subjects.length) setSubjectId(subjects[0]._id);
  }, [subjects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...note,
      title,
      body,
      subjectId,
      status,
      lastModified: Date.now(),
    });
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div>
        <label>Subject</label>
        <select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Body</label>
       <TinyMCEEditor value={body} onChange={setBody} />
          
      
      </div>

      <div className="form-actions">
        <button type="submit">{note?._id ? "Update" : "Add"} Note</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
