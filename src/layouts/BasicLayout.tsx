'use client';

import type React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Settings } from 'lucide-react';
import { HoverDropdown } from '../components/HoverDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

const BasicLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

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
            <Button variant="default" onClick={() => navigate('/write')} className="rounded-md">
              New Room
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                navigate('/login');
              }}
              className="rounded-md"
            >
              Login
            </Button>

            {/* 설정 드롭다운 */}
            <HoverDropdown
              trigger={
                <Button variant="ghost" size="icon" className="rounded-md">
                  <Settings className="h-5 w-5" />
                </Button>
              }
              items={[
                { label: 'Booking List', onClick: () => navigate('/setting/bookinglist') },
                // { label: 'My Page', onClick: () => navigate('/setting/mypage') },
                { label: 'Logout', onClick: () => navigate('/logout') },
              ]}
            />
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
