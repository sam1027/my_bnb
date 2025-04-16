import { pushGlobalMessage } from '@/lib/globalMessage';
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
interface IUserInfo {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  userInfo: IUserInfo | null;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  isLoggedIn: !!localStorage.getItem('accessToken'),
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
  login: (accessToken) => {
    const decoded = jwtDecode<IUserInfo>(accessToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userInfo', JSON.stringify(decoded));
    set({ accessToken, isLoggedIn: true, userInfo: decoded });
    pushGlobalMessage({
      type: 'success',
      content: `${decoded.name}님 환영합니다.`,
    });
    window.location.href = '/';
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, isLoggedIn: false });
    // pushGlobalMessage({
    //   type: 'success',
    //   content: '로그아웃 되었습니다.',
    // });
    window.location.href = '/';
  },
}));
