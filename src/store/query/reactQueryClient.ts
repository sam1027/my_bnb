import { QueryClient } from '@tanstack/react-query';
import { fetchRooms } from '../../api/roomApi';

export const queryClient = new QueryClient();

queryClient.setQueryDefaults(['fetchRooms'], {
  queryFn: () => fetchRooms(),
  staleTime: 0,
  gcTime: 1000 * 60 * 5,
  refetchOnWindowFocus: true, // 윈도우가 focus 될 때마다 데이터 다시 fetch
  refetchOnMount: true, // 컴포넌트가 mount될 때마다 데이터 다시 fetch
  //keepPreviousData: true, // 컴포넌트가 mounted 상태에서 queryKey가 바뀔 때 화면 깜빡임 방지
  //refetchInterval: 1000 * 60 * 10, // 10분마다 데이터 다시 fetch
});
