import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as D from '../styles/RoomDetailStyle';
import { IFile, IRoom } from '../types/room';
import Spinner from '../components/Spinner';
import Error500 from '../components/error/Error500';
import Slider from 'react-slick';
import { fetchRooms } from '../api/roomApi';
import { rq_datailPageCallOption } from '../utils/reactQueryOption';

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: room,
    isLoading,
    error,
    refetch,
  } = useQuery<IRoom[], Error, IRoom, [string, string | undefined]>({
    queryKey: ['fetchRoomDetail', id],
    queryFn: () => fetchRooms(id),
    enabled: !!id,
    select: (data) => data[0],
    ...rq_datailPageCallOption,
  });

  if (isLoading) return <Spinner />;
  if (error || !room) return <Error500 onRetry={refetch} />;

  console.log(`Room: ${JSON.stringify(room)}`);
  // const room = data.[0];

  return (
    <D.Container>
      <D.SliderWrapper>
        <Slider dots arrows infinite speed={500} slidesToShow={1} slidesToScroll={1}>
          {room.images?.map((img: IFile, i) => (
            <img
              key={i}
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${img.file_name}`}
              alt={`숙소 이미지 ${i + 1}`}
            />
          ))}
        </Slider>
      </D.SliderWrapper>

      <D.InfoSection>
        <D.Title>{room.title}</D.Title>
        <D.Address>
          {room.address} {room.address_dtl}
        </D.Address>
        <D.Price>₩{Number(room.price).toLocaleString()} / 1박</D.Price>
        <D.Description>{room.content}</D.Description>
      </D.InfoSection>
    </D.Container>
  );
};

export default RoomDetail;
