import { apiRequest } from "../utils/api";

const TODOS_URL = "/todos";

export const getTodos = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = query ? `${TODOS_URL}?${query}` : TODOS_URL;
  return apiRequest(endpoint, { method: "GET" });
};

export const createTodo = (data) =>
  apiRequest(TODOS_URL, { method: "POST", body: data });

export const updateTodo = (id, data) =>
  apiRequest(`${TODOS_URL}/${id}`, { method: "PUT", body: data });

export const deleteTodo = (id) =>
  apiRequest(`${TODOS_URL}/${id}`, { method: "DELETE" });

export const toggleCompleteTodo = (id) =>
  apiRequest(`${TODOS_URL}/complete/${id}`, { method: "PUT" });
