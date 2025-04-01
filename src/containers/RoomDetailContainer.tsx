'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Star, MapPin, ChevronLeft, ChevronRight, Calendar, Minus, Plus } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { IBookingForm, IReview, IReviewForm, IRoom } from 'src/types/room';
import { fetchReviews, fetchRoomDetail, insertBooking, insertReview } from 'src/api/roomApi';
import { rq_datailPageCallOption } from 'src/utils/reactQueryOption';
import Spinner from '@/components/Spinner';
import Error500 from '@/components/error/Error500';
import KakaoMapViewer from '@/components/KakaoMapViewer';

const RoomDetailContainer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: room,
    isLoading,
    error,
    refetch,
  } = useQuery<IRoom[], Error, IRoom, [string, string | undefined]>({
    queryKey: ['fetchRoomDetail', id],
    queryFn: () => {
      if (!id) throw new Error('Room ID is required');
      return fetchRoomDetail(id);
    },
    enabled: !!id,
    select: (data) => data[0],
    ...rq_datailPageCallOption,
  });

  const {
    data: reviews,
    isLoading: isReviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useQuery<IReview[]>({
    queryKey: ['fetchReviews', id],
    queryFn: () => {
      if (!id) throw new Error('Room ID is required');
      return fetchReviews(id);
    },
    enabled: !!id,
    ...rq_datailPageCallOption,
  });

  console.log(`reviews: ${JSON.stringify(reviews)}`);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Date picker state
  const [date, setDate] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Guest count state
  const [guestCount, setGuestCount] = useState(2);

  // Calculate nights and total price
  const [nights, setNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // 청소비
  const cleaningFee = (room && Number(room.cleaning_fee)) || 0;
  // 서비스 수수료
  const serviceFee = (room && Number(room.service_fee)) || 0;
  // 최대 인원
  const maxGuests = (room && Number(room.max_guests)) || 0;

  // Update nights and total price when dates change
  useEffect(() => {
    if (date?.from && date?.to && room?.price) {
      const nightCount = differenceInDays(date.to, date.from);
      setNights(nightCount);
      setTotalPrice((room.price || 0) * nightCount + cleaningFee + serviceFee);
    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [date, room?.price]);

  if (isLoading) return <Spinner />;
  if (error || !room) return <Error500 onRetry={refetch} />;

  // console.log(`Room: ${JSON.stringify(room)}`);

  const nextImage = () => {
    if (!room.images || room.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === room.images!.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!room.images || room.images.length === 0) return;
    setCurrentImageIndex((prev) => (prev === 0 ? room.images!.length - 1 : prev - 1));
  };

  // 후기 등록
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newReview.trim() === '' || newRating === 0) return;

    const reviewData: IReviewForm = {
      room_id: room.id!,
      rating: newRating,
      comment: newReview,
    };

    console.log('Review Data:', reviewData);

    const response = await insertReview(reviewData);

    if (response) {
      alert('후기가 등록되었습니다.');
      setNewReview('');
      setNewRating(0);
      refetchReviews();
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const incrementGuests = () => {
    if (guestCount < maxGuests) {
      setGuestCount(guestCount + 1);
    }
  };

  const decrementGuests = () => {
    if (guestCount > 1) {
      setGuestCount(guestCount - 1);
    }
  };

  // 예약하기
  const handleBooking = async () => {
    const bookingData: IBookingForm = {
      room_id: room.id!,
      checkin_dt: date?.from ? format(date.from, 'yyyy-MM-dd') : '',
      checkout_dt: date?.to ? format(date.to, 'yyyy-MM-dd') : '',
      guest_count: guestCount,
      total_price: totalPrice,
    };

    console.log('Booking Data:', bookingData);

    const bookingId = await insertBooking(bookingData);

    if (bookingId) {
      alert('예약이 완료되었습니다.');
      navigate(`/booking/${bookingId}`); // 예약 상세페이지로 이동
    }
  };

  // Default image if no images are available
  const defaultImage = '/noImage.svg?height=600&width=800';
  const currentImage =
    room.images && room.images.length > 0
      ? import.meta.env.VITE_BACKEND_URL + room.images[currentImageIndex].file_url
      : defaultImage;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{room.title}</h1>

      {/* Image Gallery */}
      <div className="relative mb-8">
        <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
          <img
            src={currentImage || '/noImage.svg'}
            alt={`${room.title} 이미지 ${currentImageIndex + 1}`}
            className="object-cover w-full h-full absolute inset-0"
          />
          {room.images && room.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">이전 이미지</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">다음 이미지</span>
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {room.images && room.images.length > 0 && (
          <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
            {room.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border-2 ${
                  index === currentImageIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={import.meta.env.VITE_BACKEND_URL + image.file_url || '/noImage.svg'}
                  alt={`썸네일 ${index + 1}`}
                  className="object-cover h-full w-full"
                />
              </button>
            ))}
          </div>
        )}

        {/* Full screen image dialog */}
        {room.images && room.images.length > 0 && (
          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  모든 사진 보기
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                      <img
                        src={import.meta.env.VITE_BACKEND_URL + image.file_url || '/noImage.svg'}
                        alt={`${room.title} 이미지 ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Accommodation Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">소개</h2>
            <p className="text-gray-700 mb-10">{room.content}</p>

            <h3 className="text-xl font-semibold mb-3">편의 시설</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-10">
              {room.amenities &&
                room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                    <span>{amenity.code_name}</span>
                  </div>
                ))}
            </div>

            <h3 className="text-xl font-semibold mb-3">위치</h3>
            {room.address && (
              <>
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>
                    {room.address} {room.address_dtl ? room.address_dtl : ''}
                  </span>
                </div>

                <KakaoMapViewer lat={room.lat} lon={room.lon} />
              </>
            )}
          </div>

          <Separator className="my-8" />

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">후기 ({reviews?.length || 0})</h2>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Number.parseFloat(calculateAverageRating() as string)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-yellow-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{calculateAverageRating()}</span>
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {reviews?.map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{review.reg_name}</div>
                    <div className="text-sm text-gray-500">{review.updated_at}</div>
                  </div>
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-400'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </Card>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="mt-8">
              <div className="mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= (hoverRating || newRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <Textarea
                  id="review"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="숙소에 대한 경험을 공유해주세요"
                  rows={4}
                  className="w-full"
                />
              </div>

              <Button type="submit" disabled={newRating === 0 || newReview.trim() === ''}>
                후기 등록
              </Button>
            </form>
          </div>
        </div>

        {/* Booking Card */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold">
                ₩{(Number(room.price) || 0).toLocaleString()}
                <span className="text-sm font-normal text-gray-500"> / 박</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{calculateAverageRating()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              {/* Date Range Picker */}
              <div>
                <label className="block text-sm mb-1">체크인 - 체크아웃</label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal h-auto py-3"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, 'yyyy년 MM월 dd일', { locale: ko })} -{' '}
                            {format(date.to, 'yyyy년 MM월 dd일', { locale: ko })}
                          </>
                        ) : (
                          format(date.from, 'yyyy년 MM월 dd일', { locale: ko })
                        )
                      ) : (
                        '날짜 선택'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      disabled={{ before: new Date() }}
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guest Selector */}
              <div>
                <label className="block text-sm mb-1">인원</label>
                <div className="flex items-center border rounded-md p-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementGuests}
                    disabled={guestCount <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">인원 감소</span>
                  </Button>
                  <span className="flex-1 text-center">게스트 {guestCount}명</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementGuests}
                    disabled={guestCount >= maxGuests}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">인원 증가</span>
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full mb-4"
              disabled={!date?.from || !date?.to}
              onClick={handleBooking}
            >
              예약하기
            </Button>

            {date?.from && date?.to ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>
                    ₩{(room.price || 0).toLocaleString()} x {nights}박
                  </span>
                  <span>₩{((room.price || 0) * nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>청소비</span>
                  <span>₩{cleaningFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>서비스 수수료</span>
                  <span>₩{serviceFee.toLocaleString()}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold">
                  <span>총 합계</span>
                  <span>₩{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                날짜를 선택하시면 요금이 표시됩니다
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailContainer;
