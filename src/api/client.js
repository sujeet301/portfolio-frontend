import axios from 'axios';

const PRIMARY_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKUP_URL = import.meta.env.VITE_API_URL_BACKUP; // optional — set this to enable failover

const RECOVERY_COOLDOWN_MS = 30_000; // after switching to backup, try primary again after 30s

// withCredentials lets the browser send/receive the httpOnly auth cookie
// set by the backend on login.
export const api = axios.create({
  baseURL: PRIMARY_URL,
  withCredentials: true,
  timeout: 5000,
});

let activeURL = PRIMARY_URL;
let recoveryTimer = null;

// Logs only "primary" or "backup" — never the actual URL — and only in production.
function logActiveBackend(label) {
  if (import.meta.env.PROD) {
    console.log(`[api] active backend: ${label}`);
  }
}

function switchTo(url, label) {
  if (activeURL === url) return; // already active, avoid duplicate logs
  activeURL = url;
  logActiveBackend(label);

  if (label === 'backup' && !recoveryTimer) {
    recoveryTimer = setTimeout(() => {
      activeURL = PRIMARY_URL;
      logActiveBackend('primary');
      recoveryTimer = null;
    }, RECOVERY_COOLDOWN_MS);
  }
}

api.interceptors.request.use((config) => {
  config.baseURL = activeURL;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    const isNetworkFailure = !error.response; // timeout / refused / DNS — not a real HTTP error from a live server
    const canFailover = BACKUP_URL && config && !config._retriedBackup && config.baseURL !== BACKUP_URL;

    if (!isNetworkFailure || !canFailover) {
      return Promise.reject(error);
    }

    config._retriedBackup = true;
    config.baseURL = BACKUP_URL;
    switchTo(BACKUP_URL, 'backup');

    return api(config);
  }
);

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