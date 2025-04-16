import { useState, useCallback, useEffect } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { IRoom } from 'src/types/room';
import { fetchRooms, toggleFavoriteButton } from 'src/api/roomApi';
import { rq_realtimeCallOption } from 'src/utils/reactQueryOption';
import { useNavigate } from 'react-router-dom';
import Error500 from '@/components/error/Error500';
import ImageSlideCard from '@/components/ImageSlideCard';

const HomeContainer = () => {
  const limit = 6;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500, { leading: false });
  const { ref, inView } = useInView();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error } = useInfiniteQuery<
    IRoom[]
  >({
    queryKey: ['fetchRooms', debouncedSearchQuery],
    queryFn: ({ pageParam = 1 }) => fetchRooms(pageParam as number, limit, debouncedSearchQuery),
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

  // 찜하기 버튼 토글 이벤트
  const toggleFavorite = async (e?: React.MouseEvent, roomId?: string) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!roomId) return;

    const result = await toggleFavoriteButton(roomId);
    if (result > 0) refetch();
  };

  // 무한 스크롤 이벤트
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  // 카드 클릭 이벤트
  const handleCardClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find your next stay</h1>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by location or property name"
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page) =>
          page.map((item) => (
            <ImageSlideCard
              key={item.id}
              room={item}
              onToggleFavorite={toggleFavorite}
              handleCardClick={handleCardClick}
            />
          ))
        )}
      </div>

      {/* No results message */}
      {searchQuery && data?.pages[0].length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No properties found</h2>
          <p className="mb-6 text-muted-foreground">
            We couldn't find any properties matching "{searchQuery}"
          </p>
          <Button onClick={() => setSearchQuery('')} variant="outline">
            Clear search
          </Button>
        </div>
      )}

      {/* Loading indicator and sentinel element for infinite scroll */}
      <div ref={ref} className="flex justify-center items-center py-8 mt-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-muted-foreground">Loading more properties...</span>
          </div>
        )}
        {(data?.pages[0].length as number) > 0 && !hasNextPage && (
          <p className="text-muted-foreground">No more Data to load</p>
        )}
      </div>
    </div>
  );
};

export default HomeContainer;
