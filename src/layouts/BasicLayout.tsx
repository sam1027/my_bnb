'use client';

import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Settings } from 'lucide-react';
import { HoverDropdown } from '../components/HoverDropdown';
import { useAuthStore } from 'src/store/zustand/useAuthStore';
import { useConfirm } from '@/contexts/ConfirmContext';
interface LayoutProps {
  children: React.ReactNode;
}

const BasicLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logoutStore = useAuthStore((state) => state.logout);
  const userInfo = useAuthStore((state) => state.userInfo);
  console.log(`isLoggedIn: ${isLoggedIn}`);

  const logoutHandler = () => {
    confirm({
      title: '로그아웃',
      description: '로그아웃 하시겠습니까?',
      onConfirm: () => {
        logoutStore();
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary/90 transition-colors"
            >
              <Home className="h-5 w-5" />
              My BNB
            </Link>
          </div>

          <nav className="flex items-center gap-3">
            {/* 숙소등록 버튼 */}
            {isLoggedIn ? (
              <Button variant="default" onClick={() => navigate('/write')} className="rounded-md">
                New Room
              </Button>
            ) : null}

            {/* 로그인/회원가입 버튼 */}
            {!isLoggedIn ? (
              <Button
                variant="outline"
                onClick={() => {
                  navigate('/login');
                }}
                className="rounded-md"
              >
                Login
              </Button>
            ) : null}

            {/* 설정 드롭다운 */}
            {isLoggedIn ? (
              <HoverDropdown
                trigger={
                  <Button variant="ghost" size="icon" className="rounded-md">
                    <Settings className="h-5 w-5" />
                  </Button>
                }
                items={[
                  { label: `Hello, ${userInfo?.name}`, onClick: () => {} },
                  { label: 'Booking List', onClick: () => navigate('/setting/bookinglist') },
                  // { label: 'My Page', onClick: () => navigate('/setting/mypage') },
                  { label: 'Logout', onClick: logoutHandler },
                ]}
              />
            ) : null}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>

      <footer className="w-full border-t bg-background text-muted-foreground text-sm">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-6 space-y-4 md:space-y-0">
          {/* 왼쪽 정보 */}
          <div className="text-center md:text-left">
            ⓒ {new Date().getFullYear()} My BNB. All rights reserved.
          </div>

          {/* 중간 링크 */}
          {/* <div className="flex gap-4">
            <a href="/privacy" className="hover:underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:underline hover:text-foreground transition-colors">
              Terms of Use
            </a>
          </div> */}

          {/* 오른쪽 SNS / 로고 등 */}
          <div className="flex gap-3">
            <a
              href="https://github.com/sam1027"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a href="mailto:yse1027@gmail.com" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BasicLayout;
