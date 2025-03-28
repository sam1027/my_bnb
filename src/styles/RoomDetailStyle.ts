import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1024px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const SliderWrapper = styled.div`
  border-radius: 20px;
  overflow: hidden;
  .slick-slide img {
    width: 100%;
    height: 450px;
    object-fit: cover;
    border-radius: 20px;
    @media (max-width: 768px) {
      height: 300px;
    }
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

export const Address = styled.p`
  font-size: 16px;
  color: #717171;
`;

export const Price = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #ff385c;
`;

export const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #333;
`;
