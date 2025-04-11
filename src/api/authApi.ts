import { useAuthStore } from 'src/store/zustand/useAuthStore';
import { apiClient } from './apiClient';

// 이메일 체크
export const checkEmail = async (email: string) => {
  const response = await apiClient.get(`/auth/check/email?email=${email}`);
  return response.data;
};

// 회원가입
export const signup = async (email: string, name: string, password: string) => {
  const response = await apiClient.post('/auth/signup', { email, name, password });
  return response.data;
};

// 로그인
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  useAuthStore.getState().login(response.data.accessToken);
  return response;
};
