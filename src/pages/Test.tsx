'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Calendar,
  ChevronRight,
  Clock,
  Home,
  MapPin,
  Search,
  Star,
  MessageCircle,
  Share,
  ArrowUpDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 예약 상태 타입
type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

// 예약 타입 정의
type Booking = {
  id: string;
  accommodationId: string;
  accommodationName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  image: string;
  host: string;
  rating?: number;
};

// 더미 데이터
const dummyBookings: Booking[] = [
  {
    id: 'b1',
    accommodationId: 'a1',
    accommodationName: '제주도의 아름다운 해변 근처 모던 하우스',
    location: '제주시, 제주도',
    checkIn: '2025-05-15',
    checkOut: '2025-05-20',
    guests: 2,
    totalPrice: 750000,
    status: 'upcoming',
    image: '/placeholder.svg?height=500&width=500&text=제주+해변+전경',
    host: '김호스트',
    rating: 4.97,
  },
  {
    id: 'b2',
    accommodationId: 'a2',
    accommodationName: '서울 시내 중심의 모던 아파트',
    location: '강남구, 서울',
    checkIn: '2025-06-10',
    checkOut: '2025-06-15',
    guests: 3,
    totalPrice: 600000,
    status: 'upcoming',
    image: '/placeholder.svg?height=500&width=500&text=강남+전경',
    host: '이호스트',
    rating: 4.85,
  },
  {
    id: 'b3',
    accommodationId: 'a3',
    accommodationName: '부산 해운대 오션뷰 펜트하우스',
    location: '해운대구, 부산',
    checkIn: '2024-12-20',
    checkOut: '2024-12-27',
    guests: 4,
    totalPrice: 1260000,
    status: 'completed',
    image: '/placeholder.svg?height=500&width=500&text=해운대+전경',
    host: '박호스트',
    rating: 4.92,
  },
  {
    id: 'b4',
    accommodationId: 'a4',
    accommodationName: '강원도 평창 산속 통나무집',
    location: '평창군, 강원도',
    checkIn: '2024-11-05',
    checkOut: '2024-11-08',
    guests: 2,
    totalPrice: 390000,
    status: 'completed',
    image: '/placeholder.svg?height=500&width=500&text=평창+전경',
    host: '최호스트',
    rating: 4.89,
  },
  {
    id: 'b5',
    accommodationId: 'a5',
    accommodationName: '경주 한옥 스테이',
    location: '경주시, 경상북도',
    checkIn: '2024-10-15',
    checkOut: '2024-10-18',
    guests: 2,
    totalPrice: 330000,
    status: 'cancelled',
    image: '/placeholder.svg?height=500&width=500&text=경주+한옥',
    host: '정호스트',
  },
];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // 필터링 및 정렬된 예약 목록
  const filteredBookings = dummyBookings
    .filter((booking) => {
      // 탭 필터링
      if (activeTab !== 'all' && booking.status !== activeTab) return false;

      // 검색어 필터링
      if (
        searchQuery &&
        !booking.accommodationName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !booking.location.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // 날짜 기준 정렬
      const dateA = parseISO(a.checkIn);
      const dateB = parseISO(b.checkIn);

      return sortOrder === 'newest'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  // 예약 상태에 따른 배지 색상 및 텍스트
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-green-500 hover:bg-green-600">예정됨</Badge>;
      case 'completed':
        return (
          <Badge variant="outline" className="text-gray-500 border-gray-300">
            완료됨
          </Badge>
        );
      case 'cancelled':
        return <Badge variant="destructive">취소됨</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <div className="flex items-center">
              <svg
                viewBox="0 0 32 32"
                className="h-8 w-8 text-[#FF385C] fill-current"
                aria-hidden="true"
              >
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.414 3.62l-.28.023-.253.002C5.7 31 3 28.68 3 24.614c0-.98.26-1.965.78-2.997l.157-.302.723-1.308C8.024 11.24 13.673 1 16 1zm0 2c-1.981 0-7.406 9.516-10.76 18.053l-.699 1.244-.159.298c-.397.734-.59 1.431-.59 2.02 0 3.096 1.7 4.386 4.392 4.386 1.622 0 3.83-1.147 5.843-3.128l.34-.349.992-1.068.763.847.257.27c1.893 1.962 3.898 3.097 5.887 3.097 2.786 0 4.736-1.538 4.736-4.48 0-.758-.177-1.622-.623-2.761l-.227-.56c-1.121-2.621-5.118-10.951-6.855-14.557l-.544-1.046C18.415 3.564 17.461 3 16 3z"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-[#FF385C] hidden md:inline">airbnb</span>
            </div>
            <h1 className="text-2xl font-bold">내 여행</h1>
            <div className="w-8"></div> {/* 균형을 위한 빈 공간 */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 필터 및 검색 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* 탭 필터 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="upcoming">예정됨</TabsTrigger>
              <TabsTrigger value="completed">완료됨</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex w-full md:w-auto gap-2">
            {/* 검색 */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="숙소 또는 위치 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full"
              />
            </div>

            {/* 정렬 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder('newest')}>최신순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('oldest')}>오래된순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 예약 목록 */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* 숙소 이미지 */}
                  <div className="md:w-1/3 h-48 md:h-auto relative">
                    <img
                      src={booking.image || '/placeholder.svg'}
                      alt={booking.accommodationName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 예약 정보 */}
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(booking.status)}
                          {booking.status === 'upcoming' && (
                            <span className="text-sm text-gray-500">
                              {getDaysUntil(booking.checkIn)}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold">{booking.accommodationName}</h2>
                      </div>

                      {booking.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current" />
                          <span>{booking.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{booking.location}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">체크인</div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{formatDate(booking.checkIn)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">체크아웃</div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{formatDate(booking.checkOut)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <Home className="h-4 w-4 mr-1 text-gray-500" />
                      <span>호스트: {booking.host}</span>
                    </div>

                    <div className="flex items-center text-gray-500 mb-4">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{getStayDuration(booking.checkIn, booking.checkOut)}</span>
                      <span className="mx-2">•</span>
                      <span>게스트 {booking.guests}명</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-lg">
                            ₩{booking.totalPrice.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm"> 총 금액</span>
                        </div>

                        <div className="flex gap-2">
                          {booking.status === 'upcoming' && (
                            <>
                              <Button variant="outline" size="sm">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                호스트에게 연락
                              </Button>
                              <Button size="sm">
                                <ChevronRight className="h-4 w-4 ml-1" />
                                예약 관리
                              </Button>
                            </>
                          )}

                          {booking.status === 'completed' && (
                            <>
                              <Button variant="outline" size="sm">
                                <Share className="h-4 w-4 mr-1" />
                                공유
                              </Button>
                              <Button size="sm">다시 예약</Button>
                            </>
                          )}

                          {booking.status === 'cancelled' && <Button size="sm">다시 예약</Button>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-medium mb-2">예약 내역이 없습니다</h3>
            <p className="text-gray-500 mb-6">첫 번째 여행을 계획해보세요!</p>
            <Button
              className="px-6 bg-[#FF385C] hover:bg-[#E31C5F]"
              onClick={() => (window.location.href = '/')}
            >
              숙소 검색하기
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

// 날짜 포맷 함수
function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'yyyy년 M월 d일 (EEE)', { locale: ko });
}

// 체크인까지 남은 일수 계산
function getDaysUntil(dateString: string): string {
  const today = new Date();
  const targetDate = parseISO(dateString);

  // 날짜 비교를 위해 시간 정보 제거
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘 체크인';
  if (diffDays === 1) return '내일 체크인';
  return `${diffDays}일 후 체크인`;
}

// 숙박 기간 계산
function getStayDuration(checkIn: string, checkOut: string): string {
  const startDate = parseISO(checkIn);
  const endDate = parseISO(checkOut);

  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays}박`;
}
