import axios from 'axios';
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + 'bnb',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fileClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + 'bnb',
  withCredentials: true,
});
