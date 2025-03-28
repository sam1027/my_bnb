import { FaHeart } from 'react-icons/fa';
import * as H from '../styles/HomeStyles';
import { useQuery } from '@tanstack/react-query';
import { IRoom } from '../types/room';
import Spinner from '../components/Spinner';
import Error500 from '../components/error/Error500';
import { fetchRooms, toggleFavoriteButton } from '../api/roomApi';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { rq_realtimeCallOption } from '../utils/reactQueryOption';

const HomeContainer = () => {
  const { data, isLoading, isFetching, refetch, error } = useQuery<IRoom[]>({
    queryKey: ['fetchRooms'],
    queryFn: () => fetchRooms(),
    ...rq_realtimeCallOption,
  });

  const navigate = useNavigate();

  if (error) return <Error500 onRetry={refetch} />;

  console.log(`list: ${JSON.stringify(data)}`);

  const handleFavorite = async (roomId?: string) => {
    if (!roomId) return;

    const result = await toggleFavoriteButton(roomId);
    if (result > 0) refetch();
  };

  return (
    <H.Container>
      <H.Header>
        <h1>숙소 리스트</h1>
      </H.Header>
      <H.Grid>
        {isLoading ? (
          <Spinner />
        ) : (
          data &&
          data.map((room) => (
            <H.Card key={room.id} onClick={() => navigate(`/room/${room.id}`)}>
              <H.ImageWrapper>
                {room.images && room.images.length > 0 ? (
                  <Slider
                    dots={false}
                    arrows={false}
                    infinite
                    speed={400}
                    slidesToShow={1}
                    slidesToScroll={1}
                    autoplay
                    autoplaySpeed={3000}
                    cssEase="linear"
                    pauseOnHover
                  >
                    {room.images.map((image, index) => (
                      <H.Image
                        key={index}
                        src={import.meta.env.VITE_BACKEND_URL + image.file_url}
                        alt={`숙소 이미지 ${index + 1}`}
                      />
                    ))}
                  </Slider>
                ) : (
                  <H.Placeholder>이미지를 업로드하세요</H.Placeholder>
                )}

                <H.FavoriteButton
                  aria-label="찜하기"
                  $liked={room.liked!}
                  onClick={() => handleFavorite(room.id)}
                >
                  <FaHeart />
                </H.FavoriteButton>
              </H.ImageWrapper>
              <H.Info>
                <H.Location>{room.title}</H.Location>
                <H.Distance>
                  {room.address} {room.address_dtl}
                </H.Distance>
                <H.Price>₩{Number(room.price)?.toLocaleString()}</H.Price>
                <H.Rating>⭐ {0}</H.Rating>
              </H.Info>
            </H.Card>
          ))
        )}
      </H.Grid>
    </H.Container>
  );
};

export default HomeContainer;
