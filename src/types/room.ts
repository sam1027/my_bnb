export interface IRoom {
  id?: string;
  title: string;
  content: string;
  address?: string;
  detailAddress?: string;
  price?: number | null;
  lat?: number;
  lon?: number;
  images?: FileList;
  liked?: boolean;
}
