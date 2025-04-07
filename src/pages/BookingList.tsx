'use client';

import { useEffect, useState } from 'react';
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
  Loader2,
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
import { useDebounce } from 'use-debounce';
import { useInView } from 'react-intersection-observer';
import { fetchBookingList, fetchRooms } from '@/api/roomApi';
import { BookingStatus, IBooking, IRoom, statusBadgeStyles } from '@/types/room';
import { useInfiniteQuery } from '@tanstack/react-query';
import { rq_realtimeCallOption } from '@/utils/reactQueryOption';
import Error500 from '@/components/error/Error500';
import { useNavigate } from 'react-router-dom';
import { getDaysUntil, getStayDuration } from '@/utils/cmnUtils';
import { formatDate } from '@/utils/cmnUtils';
import { useAlert } from '@/components/ui/ui-alerts';
import placeholderImage from '@/assets/images/property-placeholder.svg';

const BookingList = () => {
  const alert = useAlert();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const limit = 2;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500, { leading: false });
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error } = useInfiniteQuery<
    IBooking[]
  >({
    queryKey: ['fetchBookingList', debouncedSearchQuery, activeTab, sortOrder],
    queryFn: ({ pageParam = 1 }) =>
      fetchBookingList(pageParam as number, limit, debouncedSearchQuery, activeTab, sortOrder),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    ...rq_realtimeCallOption,
  });

  if (error) return <Error500 onRetry={refetch} />;

  console.log('Data type:', typeof data);
  console.log('Is Array?', Array.isArray(data));
  console.log('Data:', data);

  // 무한 스크롤 이벤트
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const handleShareEvent = async (bookingId: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `MyBnb - ${title}`,
          text: '해당 예약 내용을 확인해보세요!',
          url: `${import.meta.env.VITE_FRONTEND_URL}/booking/${bookingId}`,
        });
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      alert.error('이 브라우저는 공유 기능을 지원하지 않아요 😥');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold">예약 내역</h1>
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
                <DropdownMenuItem onClick={() => setSortOrder('desc')}>최신순</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('asc')}>오래된순</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 예약 목록 */}
        {data && data?.pages[0].length > 0 ? (
          <div className="space-y-6">
            {data.pages.map((page) =>
              page.map((bk, index) => (
                <div
                  key={bk.id}
                  className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* 숙소 이미지 */}
                    <div className="md:w-1/3 h-48 md:h-64 lg:h-80 relative overflow-hidden">
                      {bk?.room_snapshot?.images && bk.room_snapshot.images.length > 0 ? (
                        <img
                          src={
                            import.meta.env.VITE_BACKEND_URL + bk.room_snapshot.images[0].file_url
                          }
                          alt={bk.room_snapshot.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src={placeholderImage}
                          alt="Placeholder"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>

                    {/* 예약 정보 */}
                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              className={
                                statusBadgeStyles[bk.status as keyof typeof statusBadgeStyles] ||
                                statusBadgeStyles['default']
                              }
                            >
                              {bk.status_name || '-'}
                            </Badge>
                            {bk.status === 'confirmed' && (
                              <span className="text-sm text-gray-500">
                                {getDaysUntil(bk.checkin_dt)}
                              </span>
                            )}
                          </div>
                          <h2 className="text-xl font-semibold">{bk?.room_snapshot?.title}</h2>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>
                          {bk?.room_snapshot?.address} {bk?.room_snapshot?.address_dtl}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">체크인</div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{formatDate(bk.checkin_dt)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">체크아웃</div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{formatDate(bk.checkout_dt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <Home className="h-4 w-4 mr-1 text-gray-500" />
                        <span>호스트: {bk?.room_snapshot?.reg_name}</span>
                      </div>

                      <div className="flex items-center text-gray-500 mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{getStayDuration(bk.checkin_dt, bk.checkout_dt)}</span>
                        <span className="mx-2">•</span>
                        <span>게스트 {bk.guest_count}명</span>
                      </div>

                      <div className="mt-auto">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-lg">
                              ₩{bk?.total_price?.toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-sm"> 총 금액</span>
                          </div>

                          <div className="flex gap-2">
                            {bk?.status === 'confirmed' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => alert.info('준비중입니다.')}
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  호스트에게 연락
                                </Button>
                                <Button size="sm" onClick={() => navigate(`/booking/${bk.id}`)}>
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                  예약 상세보기
                                </Button>
                              </>
                            )}

                            {(bk?.status === 'checked_in' ||
                              bk?.status === 'checked_out' ||
                              bk?.status === 'noshow' ||
                              bk?.status === 'cancelled') && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleShareEvent(bk.id, bk?.room_snapshot?.title)}
                                >
                                  <Share className="h-4 w-4 mr-1" />
                                  공유
                                </Button>
                                <Button size="sm" onClick={() => navigate(`/room/${bk.room_id}`)}>
                                  다시 예약
                                </Button>
                              </>
                            )}

                            {/* {bk?.status === 'cancelled' && (
                              <Button size="sm" onClick={() => navigate(`/room/${bk.room_id}`)}>
                                다시 예약
                              </Button>
                            )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator and sentinel element for infinite scroll */}
            <div ref={ref} className="flex justify-center items-center py-8 mt-4">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Loading more properties...</span>
                </div>
              )}
              {!hasNextPage && <p className="text-muted-foreground">No more Data to load</p>}
            </div>
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
};

export default BookingList;
