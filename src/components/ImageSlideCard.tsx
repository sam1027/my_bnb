import { IRoom } from '@/types/room';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import placeholderImage from '@/assets/images/property-placeholder.svg';
import { Heart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from 'src/store/zustand/useAuthStore';

interface ImageSlideCardProps {
  room: IRoom;
  onToggleFavorite: (e?: React.MouseEvent, roomId?: string) => void;
  handleCardClick: (roomId: string) => void;
}

const ImageSlideCard = ({ room, onToggleFavorite, handleCardClick }: ImageSlideCardProps) => {
  // Check if property has images
  const hasImages = room.images && room.images.length > 0;
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {hasImages ? (
          <Carousel className="w-full">
            <CarouselContent>
              {room.images?.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square">
                    <img
                      src={import.meta.env.VITE_BACKEND_URL + image.file_url}
                      alt={`${room.title} - Image ${index + 1}`}
                      className="object-cover w-full h-full rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.onerror = null; // placeholderImage도 에러일 경우 무한 루프 방지
                        e.currentTarget.src = placeholderImage;
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {room.images && room.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        ) : (
          <div className="relative aspect-square rounded-t-lg overflow-hidden">
            <img
              src={placeholderImage}
              alt={`${room.title} - Placeholder`}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* 찜버튼 */}
        {isLoggedIn ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={(e) => onToggleFavorite(e, room.id)}
          >
            <Heart
              className={cn(
                'h-5 w-5',
                room.liked ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              )}
            />
            <span className="sr-only">
              {room.liked ? 'Remove from favorites' : 'Add to favorites'}
            </span>
          </Button>
        ) : null}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3
            className="font-semibold text-lg line-clamp-1 hover:underline hover:cursor-pointer"
            onClick={() => handleCardClick(room.id)}
          >
            {room.title}
          </h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{room.avg_rating || 0}</span>
            <span className="text-muted-foreground">({room.review_count || 0})</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          {room.address} {room.address_dtl}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="font-semibold">₩{Number(room.price).toLocaleString()}</span>
          <span className="text-muted-foreground"></span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImageSlideCard;
