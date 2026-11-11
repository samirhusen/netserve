import axios from 'axios';

// One Axios instance for the whole app, pointing at the Spring Boot backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Attach the JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is expired or invalid, log the user out and send them to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/api/auth/');
    if (error.response?.status === 401 && !isAuthRequest && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?expired=1';
    }
    return Promise.reject(error);
  }
);

// Turns any backend error into one readable sentence
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response) {
    return 'Cannot reach the server. Make sure the backend is running.';
  }
  const data = error.response.data;
  if (!data) return fallback;
  if (typeof data === 'string') return data || fallback;
  if (data.message) return data.message;

  // Validation errors come back as { field: "message" }
  const messages = Object.values(data).filter((value) => typeof value === 'string');
  return messages.length ? messages.join('. ') : fallback;
}

// Returns validation errors as { field: "message" } so forms can show them under each input
export function getFieldErrors(error) {
  const data = error?.response?.data;
  if (error?.response?.status === 400 && data && typeof data === 'object' && !data.message) {
    return data;
  }
  return {};
}

export default api;
