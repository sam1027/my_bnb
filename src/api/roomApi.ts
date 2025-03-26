import { fileClient } from './apiClient';

// 숙박업소 등록
export const insertRoom = async (data: FormData) => {
  const response = await fileClient.post('/bnb', data);
  return response.data;
};

// 숙박업소 조회
export const fetchRooms = async (id?: string) => {
  const url = id ? `/bnb?id=${id}` : '/bnb';
  const response = await fileClient.get(url);
  return response.data;
};
