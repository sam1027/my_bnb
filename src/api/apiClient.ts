import axios from 'axios';
import { useAuthStore } from 'src/store/zustand/useAuthStore';
import { pushGlobalMessage } from '@/lib/globalMessage';
const loginUrl = '/my-bnb/login';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + 'bnb',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    console.log(`apiClient response status: ${status}`);

    // 토큰 만료 또는 미로그인 → 로그아웃 처리
    if (status === 401) {
      console.error(err.response?.data.message);
      pushGlobalMessage({
        type: 'error',
        content: '로그인이 필요한 서비스입니다. 로그인 해주세요.',
      });
      useAuthStore.getState().logout();
      window.location.href = loginUrl;
    }

    // 권한 부족 -> 토큰 갱신 후 재시도 -> 실패 시 로그아웃 처리
    if (status === 403) {
      try {
        const refreshRes = await axios.post('/auth/refresh', {}, { withCredentials: true });
        const newToken = refreshRes.data.accessToken;
        useAuthStore.getState().login(newToken);

        // 실패한 요청 재시도
        err.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(err.config);
      } catch {
        console.error(err.response?.data.message);
        pushGlobalMessage({
          type: 'error',
          content: err.response?.data.message,
          // content: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.',
        });
        // useAuthStore.getState().logout();
        window.location.href = '/';
      }
    }

    if (status === 500) {
      pushGlobalMessage({
        type: 'error',
        content: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
      window.location.href = '/my-bnb/error/500';
    }

    return Promise.reject(err);
  }
);

export const fileClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + 'bnb',
  withCredentials: true,
});

fileClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

fileClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    console.log(`fileClient response status: ${status}`);

    // 토큰 만료 또는 미로그인 → 로그아웃 처리
    if (status === 401) {
      console.error(err.response?.data.message);
      pushGlobalMessage({
        type: 'error',
        content: '로그인이 필요한 서비스입니다. 로그인 해주세요.',
      });
      useAuthStore.getState().logout();
      window.location.href = loginUrl;
    }

    // 권한 부족 -> 토큰 갱신 후 재시도 -> 실패 시 로그아웃 처리
    if (status === 403) {
      try {
        const refreshRes = await axios.post('/auth/refresh', {}, { withCredentials: true });
        const newToken = refreshRes.data.accessToken;
        useAuthStore.getState().login(newToken);

        // 실패한 요청 재시도
        err.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient.request(err.config);
      } catch {
        console.error(err.response?.data.message);
        pushGlobalMessage({
          type: 'error',
          content: '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.',
        });
        useAuthStore.getState().logout();
        window.location.href = loginUrl;
      }
    }
    return Promise.reject(err);
  }
);
