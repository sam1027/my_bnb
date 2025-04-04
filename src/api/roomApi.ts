import { IBookingForm, IReviewForm } from 'src/types/room';
import { apiClient, fileClient } from './apiClient';

// 숙박업소 등록
export const insertRoom = async (data: FormData) => {
  const response = await fileClient.post('/bnb', data);
  return response.data;
};

// 숙박업소 조회
export const fetchRooms = async (page: number, limit: number, searchQuery: string) => {
  const response = await apiClient.get(`/bnb?page=${page}&limit=${limit}&search=${searchQuery}`);
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

// 후기 등록
export const insertReview = async (data: IReviewForm) => {
  const response = await apiClient.post('/bnb/review', data);
  return response.data;
};

// 후기 조회
export const fetchReviews = async (roomId: string) => {
  const response = await apiClient.get(`/bnb/review?room_id=${roomId}`);
  return response.data;
};

// 예약 등록
export const insertBooking = async (data: IBookingForm) => {
  const response = await apiClient.post('/bnb/booking', data);
  return response.data;
};

// 예약 조회
export const fetchBookingDetail = async (bookingId: string) => {
  const response = await apiClient.get(`/bnb/booking/detail?booking_id=${bookingId}`);
  return response.data;
};

// 예약 상태 변경
export const updateBookingStatus = async (bookingId: string, status: string) => {
  const response = await apiClient.patch(`/bnb/booking/status`, {
    booking_id: bookingId,
    status,
  });
  return response.data;
};
