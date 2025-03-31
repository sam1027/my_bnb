import { apiClient, fileClient } from './apiClient';

// 숙박업소 등록
export const insertRoom = async (data: FormData) => {
  const response = await fileClient.post('/bnb', data);
  return response.data;
};

// 숙박업소 조회
export const fetchRooms = async () => {
  const response = await apiClient.get('/bnb');
  return response.data;
};

// 숙박업소 상세 조회
export const fetchRoomDetail = async (id: string) => {
  const response = await apiClient.get(`/bnb/detail?id=${id}`);
  return response.data;
};

// 좋아요 설정/해제 처리
export const toggleFavoriteButton = async (roomId: string) => {
  const response = await apiClient.post('/bnb/favorite', { roomId });
  return response.data;
};
