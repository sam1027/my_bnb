'use client';

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

export default function BookingConfirmationPreview() {
  // 더미 데이터
  const booking = {
    id: 'BK12345',
    status: 'confirmed',
    checkin_dt: '2025-04-15',
    checkout_dt: '2025-04-18',
    guest_count: 2,
    total_price: 450000,
    guest_email: 'guest@example.com',
    room_id: 'RM789',
  };

  // 숙박 일수 계산
  const nights = 3; // 더미 데이터에서는 3박으로 고정

  const room = {
    id: 'RM789',
    title: '아름다운 해변가 펜션',
    address: '부산광역시 해운대구 해변로 123',
    address_dtl: '201호',
    price: 150000,
    cleaning_fee: 50000,
    service_fee: 30000,
    images: [{ file_url: '/placeholder.svg?height=600&width=800' }],
    amenities: [
      { code_name: '무료 와이파이' },
      { code_name: '에어컨' },
      { code_name: '주방' },
      { code_name: '수영장' },
      { code_name: '주차장' },
    ],
  };

  // 예약 상태에 따른 배지 색상
  const getStatusBadge = () => {
    switch (booking.status) {
      case 'confirmed':
        return <Badge className="bg-green-500">예약 확정</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">승인 대기중</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">취소됨</Badge>;
      default:
        return <Badge>처리중</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" className="flex items-center gap-2">
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

      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-4">
        <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
        <div>
          <h2 className="text-xl font-semibold text-green-800">예약이 완료되었습니다!</h2>
          <p className="text-green-700">
            예약 확인 이메일이 {booking.guest_email}로 발송되었습니다.
          </p>
        </div>
      </div>

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
                    <p className="font-medium">2025년 04월 15일 (화)</p>
                    <p className="text-sm text-gray-500">오후 3:00 이후</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarCheck className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">체크아웃</p>
                    <p className="font-medium">2025년 04월 18일 (금)</p>
                    <p className="text-sm text-gray-500">오전 11:00 이전</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">게스트</p>
                  <p className="font-medium">게스트 {booking.guest_count}명</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">결제 정보</p>
                  <p className="font-medium">
                    총 결제 금액: ₩{booking.total_price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">결제 완료</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Home className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">예약 번호</p>
                  <p className="font-medium">{booking.id}</p>
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
                    src="/placeholder.svg?height=200&width=200"
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{room.title}</h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {room.address} {room.address_dtl}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-100">
                        {amenity.code_name}
                      </Badge>
                    ))}
                    {room.amenities.length > 3 && (
                      <Badge variant="outline" className="bg-gray-100">
                        +{room.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
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
              <div className="flex items-center justify-between">
                <div className="text-gray-700">숙박비</div>
                <div className="flex flex-col items-end">
                  <div className="font-medium">₩{(room.price * nights).toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    ₩{room.price.toLocaleString()} x {nights}박
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-700">청소비</div>
                <div className="font-medium">₩{room.cleaning_fee.toLocaleString()}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-gray-700">서비스 수수료</div>
                <div className="font-medium">₩{room.service_fee.toLocaleString()}</div>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between pt-2">
                <div className="text-lg font-bold">총 합계</div>
                <div className="text-lg font-bold">₩{booking.total_price.toLocaleString()}</div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button className="w-full" variant="outline">
                영수증 인쇄
              </Button>
              <Button className="w-full" variant="destructive">
                예약 취소 요청
              </Button>
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
}
