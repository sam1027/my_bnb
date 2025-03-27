import { FaHeart } from 'react-icons/fa';
import * as H from '../styles/HomeStyles';
import { useQuery } from '@tanstack/react-query';
import { IRoom } from '../types/room';
import Spinner from '../components/Spinner';
import Error500 from '../components/error/Error500';
import { toggleFavoriteButton } from '../api/roomApi';

const HomeContainer = () => {
  const { data, isLoading, isFetching, refetch, error } = useQuery<IRoom[]>({
    queryKey: ['fetchRooms'],
  });

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
            <H.Card key={room.id}>
              <H.ImageWrapper>
                {room.images ? (
                  <H.Image src="" alt={`숙소`} />
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
                <H.Location>{room.address}</H.Location>
                <H.Distance>100</H.Distance>
                <H.Price>₩{Number(room.price)?.toLocaleString()} / 1박</H.Price>
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
