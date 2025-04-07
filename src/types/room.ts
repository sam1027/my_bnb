import { ICode } from './code';

// 예약 상태 타입
export type BookingStatus = 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out' | 'noshow';

// 예약 상태에 따른 배지 스타일
export const statusBadgeStyles = {
  confirmed: 'bg-green-500 hover:bg-green-600',
  cancelled: 'bg-red-500 hover:bg-red-600',
  checked_in: 'bg-yellow-500 hover:bg-yellow-600',
  checked_out: 'bg-gray-500 hover:bg-gray-600',
  noshow: 'bg-gray-500 hover:bg-gray-600',
  default: 'bg-gray-500 hover:bg-gray-600',
} as const;
export interface IFile {
  file_id: string;
  room_id: string;
  file_name: string;
  file_url: string;
  file_original_name: string;
  file_size: string;
  file_type: string;
}

export interface IReview {
  id: string;
  room_id: string;
  reg_id: string;
  reg_name: string;
  rating: number;
  comment: string;
  updated_at: string;
}

export interface IReviewForm {
  room_id: string;
  rating: number;
  comment: string;
}
export interface IRoom {
  id: string;
  title: string;
  content: string;
  address?: string;
  address_dtl?: string;
  price?: number | null;
  lat?: number;
  lon?: number;
  images?: IFile[];
  liked?: boolean;
  reviews?: [];
  service_fee?: number;
  cleaning_fee?: number;
  max_guests?: number;
  amenities?: ICode[];
  avg_rating?: number;
  review_count?: number;
  reg_id?: string;
  reg_name?: string;
  reg_email?: string;
}

export interface IRoomForm {
  title: string;
  content: string;
  price: number | null;
  address: string;
  address_dtl: string;
  lat: number;
  lon: number;
  images?: FileList;
  amenities?: string[];
  max_guests?: number;
  service_fee?: number;
  cleaning_fee?: number;
}

export interface IBookingForm {
  room_id: string;
  checkin_dt: string;
  checkout_dt: string;
  guest_count: number;
  total_price: number;
}

export interface IBooking {
  id: string;
  room_id: string;
  reg_id: string;
  reg_email: string;
  reg_name: string;
  checkin_dt: string;
  checkout_dt: string;
  guest_count: number;
  total_price: number;
  status: string;
  status_name: string;
  room_snapshot: IRoom;
  created_at: string;
  updated_at: string;
}
