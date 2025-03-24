import { fileClient } from './apiClient';

// 숙박업소 등록
export const createRoom = async (data: FormData) => {
  const response = await fileClient.post('/bnb', data);
  return response.data;
};
