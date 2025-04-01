import { apiClient } from './apiClient';

// 공통코드 조회
export const fetchCodes = async (code_group_id: string) => {
  const response = await apiClient.get(`/bnb/codes?code_group_id=${code_group_id}`);
  return response.data;
};
