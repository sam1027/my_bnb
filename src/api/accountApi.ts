import { apiClient } from './apiClient';

// 공통코드 조회
export const fetchCodes = async (code_group_id: string) => {
  const response = await apiClient.get(`/codes?code_group_id=${code_group_id}`);
  return response.data;
};

// 이메일 체크
export const checkEmail = async (email: string) => {
  const response = await apiClient.get(`/account/check/email?email=${email}`);
  return response.data;
};
