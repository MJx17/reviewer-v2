// src/services/notesService.js
import { apiRequest } from "../utils/api";

const NOTES_URL = "/notes";

/**
 * Fetch all notes, optionally filtered by query parameters.
 *
 * @param {Object} [params={}] - Optional query parameters (e.g., { subjectId: "123" }).
 * @returns {Promise<Array>} - Promise resolving to an array of notes.
 *
 * @example
 * getNotes({ subjectId: "123" }).then(notes => console.log(notes));
 */
export const getNotes = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `${NOTES_URL}?${query}` : NOTES_URL;
  return apiRequest(endpoint, { method: 'GET' });
};

// src/services/noteService.js
// export const getNotes = (params = {}) => {
//   const query = new URLSearchParams(params).toString();
//   const endpoint = query ? `${NOTES_URL}?${query}` : NOTES_URL;
//   return apiRequest(endpoint, { method: "GET" });
// };


export const getNoteById = async (id) => {
  return apiRequest(`/notes/${id}`); // backend route: GET /notes/:id
};
/**
 * Create a new note.
 *
 * @param {Object} data - Note data (e.g., { title, body, subjectId }).
 * @returns {Promise<Object>} - Promise resolving to the created note.
 *
 * @example
 * createNote({ title: "New Note", body: "Content", subjectId: "123" });
 */
export const createNote = (data) =>
  apiRequest(NOTES_URL, { method: 'POST', body: data });

/**
 * Update an existing note.
 *
 * @param {string} id - The ID of the note to update.
 * @param {Object} data - Updated note data (e.g., { title, body }).
 * @returns {Promise<Object>} - Promise resolving to the updated note.
 *
 * @example
 * updateNote("noteId123", { title: "Updated title" });
 */
export const updateNote = (id, data) =>
  apiRequest(`${NOTES_URL}/${id}`, { method: 'PUT', body: data });

/**
 * Delete a note.
 *
 * @param {string} id - The ID of the note to delete.
 * @returns {Promise<null>} - Promise resolving to null (DELETE returns no JSON).
 *
 * @example
 * deleteNote("noteId123").then(() => console.log("Deleted"));
 */
export const deleteNote = (id) =>
  apiRequest(`${NOTES_URL}/${id}`, { method: 'DELETE' });

/**
 * Mark a note as reviewed (or perform any custom review action supported by API).
 *
 * @param {string} id - The ID of the note.
 * @param {Object} data - Review data (e.g., { grade: 5 }).
 * @returns {Promise<Object>} - Promise resolving to the updated note review info.
 *
 * @example
 * reviewNote("noteId123", { grade: 5 });
 */
export const reviewNote = (id, data) =>
  apiRequest(`${NOTES_URL}/${id}/review`, { method: 'POST', body: data });
