import { apiClient, fileClient } from './apiClient';

// 숙박업소 등록
export const insertRoom = async (data: FormData) => {
  const response = await fileClient.post('/bnb', data);
  return response.data;
};

// 숙박업소 조회
export const fetchRooms = async (id?: string) => {
  const url = id ? `/bnb?id=${id}` : '/bnb';
  const response = await apiClient.get(url);
  return response.data;
};

// 좋아요 설정/해제 처리
export const toggleFavoriteButton = async (roomId: string) => {
  const response = await apiClient.post('/bnb/favorite', { roomId });
  return response.data;
};
