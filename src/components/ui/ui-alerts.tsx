import { useToast } from '@/components/hooks/use-toast';

// Alert 함수 - 토스트 알림을 표시합니다
export function useAlert() {
  const { toast } = useToast();

  return {
    success: (message: string) => {
      toast({
        title: '성공',
        description: message,
        variant: 'success',
      });
    },
    error: (message: string) => {
      toast({
        title: '오류',
        description: message,
        variant: 'destructive',
      });
    },
    info: (message: string) => {
      toast({
        description: message,
        variant: 'default',
      });
    },
  };
}
