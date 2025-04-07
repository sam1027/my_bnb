import axios from 'axios';
export const apiClient = axios.create({
  baseURL: '/bnb',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fileClient = axios.create({
  baseURL: '/bnb',
  withCredentials: true,
});
