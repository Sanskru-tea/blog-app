import axios from 'axios';

// Base URL for the backend REST API.
// Override with VITE_API_URL in a .env file if your backend runs elsewhere.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log("API_URL =", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blogToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getCurrentUser = () => api.get('/auth/me');

// Post endpoints
export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export default api;
