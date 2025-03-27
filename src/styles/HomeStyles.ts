import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    font-weight: bold;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;

  // 슬라이더 안에서 이미지 크기 고정
  .slick-slider,
  .slick-list,
  .slick-track,
  .slick-slide > div {
    height: 100%;
  }
`;

export const Placeholder = styled.div`
  width: 100%;
  height: 200px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 14px;
`;

interface FavoriteButtonProps {
  $liked: boolean;
}

export const FavoriteButton = styled.button<FavoriteButtonProps>`
  position: absolute;
  top: 10px;
  right: 10px;

  /* ✅ 버튼 자체 안 보이게 만들기 */
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  outline: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ $liked }) => ($liked ? 'red' : 'grey')};
    font-size: 18px;
    transition: color 0.2s ease;
    &:hover {
      color: red;
    }
  }
`;

export const Info = styled.div`
  padding: 15px;
`;

export const Location = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Distance = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
`;

export const Price = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #ff385c;
`;

export const Rating = styled.p`
  font-size: 14px;
  color: #ffa500;
`;
