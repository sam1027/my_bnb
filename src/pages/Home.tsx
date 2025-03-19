import React from 'react';
import { FaHeart } from 'react-icons/fa';
import * as H from '../styles/HomeStyles';

// 숙소 데이터 타입 정의
interface Stay {
  id: number;
  image: string;
  location: string;
  distance: string;
  price: string;
  rating: number;
}

const stayList: Stay[] = [
  {
    id: 1,
    image: '',
    location: '한국 홍천',
    distance: '60km 거리',
    price: '₩136,941 / 박',
    rating: 4.88,
  },
  {
    id: 2,
    image: '',
    location: '한국 원주시',
    distance: '78km 거리',
    price: '₩171,177 / 박',
    rating: 4.98,
  },
  {
    id: 3,
    image: '',
    location: '한국 양평',
    distance: '66km 거리',
    price: '₩230,256 / 박',
    rating: 4.96,
  },
];

const Home: React.FC = () => {
  return (
    <H.Container>
      <H.Header>
        <h1>숙소 리스트</h1>
      </H.Header>
      <H.Grid>
        {stayList.map((stay) => (
          <H.Card key={stay.id}>
            <H.ImageWrapper>
              {stay.image ? (
                <H.Image src={stay.image} alt={`${stay.location} 숙소`} />
              ) : (
                <H.Placeholder>이미지를 업로드하세요</H.Placeholder>
              )}
              <H.FavoriteButton aria-label="찜하기">
                <FaHeart />
              </H.FavoriteButton>
            </H.ImageWrapper>
            <H.Info>
              <H.Location>{stay.location}</H.Location>
              <H.Distance>{stay.distance}</H.Distance>
              <H.Price>{stay.price}</H.Price>
              <H.Rating>⭐ {stay.rating}</H.Rating>
            </H.Info>
          </H.Card>
        ))}
      </H.Grid>
    </H.Container>
  );
};

export default Home;
