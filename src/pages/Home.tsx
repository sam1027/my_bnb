import React from 'react';
import { FaHeart } from 'react-icons/fa';
import * as H from '../styles/HomeStyles';
import sampleImg1 from '../assets/images/sample_img_1.jpg';

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
    image: 'https://source.unsplash.com/400x300/?house,nature',
    location: '한국 홍천',
    distance: '60km 거리',
    price: '₩136,941 / 박',
    rating: 4.88,
  },
  {
    id: 2,
    image: 'https://source.unsplash.com/400x300/?villa,pool',
    location: '한국 원주시',
    distance: '78km 거리',
    price: '₩171,177 / 박',
    rating: 4.98,
  },
  {
    id: 3,
    image: 'https://source.unsplash.com/400x300/?cabin,forest',
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
              <img src={sampleImg1} alt={stay.location} />
              <H.FavoriteButton>
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
