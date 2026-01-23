import { apiRequest } from "../utils/api";

const SUBJECTS_URL = "/subjects";

export const getSubjects = () =>
  apiRequest(SUBJECTS_URL, { method: "GET" });

export const getSubjectById = (id) =>
  apiRequest(`${SUBJECTS_URL}/${id}`, { method: "GET" });

export const createSubject = (data) =>
  apiRequest(SUBJECTS_URL, { method: "POST", body: data });

export const updateSubject = (id, data) =>
  apiRequest(`${SUBJECTS_URL}/${id}`, { method: "PUT", body: data });

export const deleteSubject = (id) =>
  apiRequest(`${SUBJECTS_URL}/${id}`, { method: "DELETE" });
