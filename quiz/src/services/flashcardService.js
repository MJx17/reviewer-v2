import { apiRequest } from "../utils/api";

const FLASHCARD_URL = "/flashcards";

export const getFlashcards = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `${FLASHCARD_URL}?${query}` : FLASHCARD_URL;
  return apiRequest(endpoint, { method: 'GET' });
};

export const createFlashcard = (data) => 
  apiRequest(FLASHCARD_URL, { method: 'POST', body: data });

export const updateFlashcard = (id, data) => 
  apiRequest(`${FLASHCARD_URL}/${id}`, { method: 'PUT', body: data });

export const deleteFlashcard = (id) => 
  apiRequest(`${FLASHCARD_URL}/${id}`, { method: 'DELETE' });

export const reviewFlashcard = (id, grade) => 
  apiRequest(`${FLASHCARD_URL}/${id}/review`, { method: 'POST', body: { grade } });
