import { ICode } from './code';

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
