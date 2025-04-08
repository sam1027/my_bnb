import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

// 날짜 포맷 함수
export function formatDate(dateString: string): string {
  return dateString ? format(parseISO(dateString), 'yyyy년 M월 d일 (EEE)', { locale: ko }) : '';
}

// 체크인까지 남은 일수 계산
export function getDaysUntil(dateString: string): string {
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
export function getStayDuration(checkIn: string, checkOut: string): string {
  if (!checkIn || !checkOut) return '';

  const startDate = parseISO(checkIn);
  const endDate = parseISO(checkOut);

  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays}박`;
}

// 이메일 유효성 검사
export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
