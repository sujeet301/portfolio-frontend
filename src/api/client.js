import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// withCredentials lets the browser send/receive the httpOnly auth cookie
// set by the backend on login.
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ---- Auth ----
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// ---- Skills ----
export const skillsApi = {
  list: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  remove: (id) => api.delete(`/skills/${id}`),
};

// ---- Projects ----
export const projectsApi = {
  list: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  remove: (id) => api.delete(`/projects/${id}`),
};

// ---- Profile ----
export const profileApi = {
  get: () => api.get('/profile'),
  update: (data) => api.put('/profile', data),
};
