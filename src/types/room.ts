import { ICode } from "./code";

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
export interface IRoom extends IFile {
  id?: string;
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
