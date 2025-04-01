'use client';
import { useParams, useNavigate } from 'react-router-dom';
import { differenceInDays, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import {
  CalendarCheck,
  Users,
  CreditCard,
  Home,
  CheckCircle,
  ArrowLeft,
  Share2,
  Printer,
  Download,
  MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/Spinner';
import Error500 from '@/components/error/Error500';
import { fetchBookingDetail, fetchRoomDetail } from 'src/api/roomApi';
import type { IBooking, IRoom } from 'src/types/room';
import { rq_datailPageCallOption } from 'src/utils/reactQueryOption';

const BookingConfirm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 예약 정보 조회
  const { data, isLoading, error, refetch } = useQuery<IBooking>({
    queryKey: ['fetchBookingDetail', id],
    queryFn: () => {
      if (!id) throw new Error('Booking ID is required');
      return fetchBookingDetail(id);
    },
    enabled: !!id,
    ...rq_datailPageCallOption,
  });

  if (isLoading) return <Spinner />;
  if (error || !data)
    return (
      <Error500
        onRetry={() => {
          refetch();
        }}
      />
    );

  // 숙박 일수 계산
  const nights = differenceInDays(new Date(data.checkout_dt), new Date(data.checkin_dt));

  // 예약 상태에 따른 배지 스타일
  const statusBadgeStyles = {
    confirmed: 'bg-green-500',
    cancelled: 'bg-red-500',
    checked_in: 'bg-yellow-500',
    checked_out: 'bg-gray-500',
    noshow: 'bg-gray-500',
    default: 'bg-gray-500',
  } as const;

  // 예약 상태에 따른 배지 색상
  const getStatusBadge = () => (
    <Badge
      className={
        statusBadgeStyles[data.status as keyof typeof statusBadgeStyles] ||
        statusBadgeStyles['default']
      }
    >
      {data.status_name || '-'}
    </Badge>
  );

  // 숙소 이미지
  const roomImage =
    data.room_snapshot.images && data.room_snapshot.images.length > 0
      ? import.meta.env.VITE_BACKEND_URL + data.room_snapshot.images[0].file_url
      : '/noImage.svg';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          뒤로 가기
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">공유하기</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">인쇄하기</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">PDF 저장</span>
          </Button>
        </div>
      </div>

      {data.status === 'confirmed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-4">
          <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-green-800">예약이 완료되었습니다!</h2>
            <p className="text-green-700">
              예약 확인 이메일이 {data.reg_email || '등록된 이메일'}로 발송되었습니다.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>예약 정보</CardTitle>
                {getStatusBadge()}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex items-start gap-3">
                  <CalendarCheck className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">체크인</p>
                    <p className="font-medium">
                      {format(new Date(data.checkin_dt), 'yyyy년 MM월 dd일 (EEE)', {
                        locale: ko,
                      })}
                    </p>
                    <p className="text-sm text-gray-500">오후 3:00 이후</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">체크아웃</p>
                    <p className="font-medium">
                      {format(new Date(data.checkout_dt), 'yyyy년 MM월 dd일 (EEE)', {
                        locale: ko,
                      })}
                    </p>
                    <p className="text-sm text-gray-500">오전 11:00 이전</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">게스트</p>
                  <p className="font-medium">게스트 {data.guest_count}명</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">결제 정보</p>
                  <p className="font-medium">총 결제 금액: ₩{data.total_price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">결제 완료</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">예약 번호</p>
                  <p className="font-medium">{data.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>숙소 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={roomImage || '/placeholder.svg'}
                    alt={data.room_snapshot.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{data.room_snapshot.title}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {data.room_snapshot.address}{' '}
                      {data.room_snapshot.address_dtl ? data.room_snapshot.address_dtl : ''}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {data.room_snapshot.amenities &&
                      data.room_snapshot.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-100">
                          {amenity.code_name}
                        </Badge>
                      ))}
                    {data.room_snapshot.amenities && data.room_snapshot.amenities.length > 3 && (
                      <Badge variant="outline" className="bg-gray-100">
                        +{data.room_snapshot.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/room/${data.room_snapshot.id}`)}
              >
                숙소 상세 보기
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>요금 세부 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const roomPrice = Number(data.room_snapshot.price) * nights;

                return (
                  <>
                    <div className="flex justify-between">
                      <span>
                        ₩{Number(data.room_snapshot.price).toLocaleString()} x {nights}박
                      </span>
                      <span>₩{roomPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>청소비</span>
                      <span>₩{Number(data.room_snapshot.cleaning_fee).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>서비스 수수료</span>
                      <span>₩{Number(data.room_snapshot.service_fee).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>총 합계</span>
                      <span>₩{data.total_price.toLocaleString()}</span>
                    </div>
                  </>
                );
              })()}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" variant="outline" onClick={() => window.print()}>
                영수증 인쇄
              </Button>
              {data.status === 'confirmed' && (
                <Button className="w-full" variant="destructive">
                  예약 취소 요청
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">알아두세요</h3>
        <ul className="space-y-2 text-blue-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>체크인은 오후 3시부터, 체크아웃은 오전 11시까지입니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>숙소 내 흡연은 금지되어 있습니다.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>반려동물 동반 시 사전에 호스트에게 알려주세요.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>체크인 24시간 전까지 무료로 예약을 취소할 수 있습니다.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BookingConfirm;
