import axios from 'axios';
export const apiClient = axios.create({
  baseURL: 'http://localhost:4000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fileClient = axios.create({
  baseURL: 'http://localhost:4000/',
  withCredentials: true,
});
