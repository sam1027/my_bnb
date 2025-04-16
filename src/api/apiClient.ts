import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from 'src/store/zustand/useAuthStore';
import { pushGlobalMessage } from '@/lib/globalMessage';
const loginUrl = '/my-bnb/login';
const baseURL = import.meta.env.VITE_BACKEND_URL + 'bnb';

/**
 * 요청 인터셉터: 토큰 추가
 */
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

/**
 * 응답 인터셉터: 에러 처리 및 토큰 재발급
 */
const responseInterceptor = (instance: AxiosInstance) => {
  return async (err: AxiosError) => {
    const status = err.response?.status;
    const message = (err.response?.data as { message?: string })?.message;

    console.log(`${instance.defaults.baseURL} response status: ${status}`);

    // 토큰 만료 또는 미로그인 → 로그아웃 처리
    if (status === 401) {
      console.error(message);
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
        if (err.config && err.config.headers) {
          err.config.headers.Authorization = `Bearer ${newToken}`;
          return instance.request(err.config);
        }
      } catch (refreshErr: any) {
        console.error(refreshErr.response?.data.message);
        pushGlobalMessage({
          type: 'error',
          content: refreshErr.response?.data.message,
        });
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
  };
};

/**
 * Axios 인스턴스 생성 함수
 */
const createApiClient = (withJsonHeader: boolean = true) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: withJsonHeader
      ? {
          'Content-Type': 'application/json',
        }
      : {},
  });

  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use((res: AxiosResponse) => res, responseInterceptor(instance));

  return instance;
};

// ✅ 사용 예시
export const apiClient = createApiClient(true);
export const fileClient = createApiClient(false);
