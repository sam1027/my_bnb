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

            <Button variant="outline" onClick={() => {}} className="rounded-md">
              Login
            </Button>
            <Button variant="outline" onClick={() => {}} className="rounded-md">
              Join
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
    </div>
  );
};

export default BasicLayout;
