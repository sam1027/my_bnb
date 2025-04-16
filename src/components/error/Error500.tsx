import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.bgColor};
`;

const Icon = styled(FaExclamationTriangle)`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #111827;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.75rem;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: #4b5563;
  max-width: 90%;
  text-align: center;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    font-size: 1.125rem;
    max-width: 500px;
  }
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.danger};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #dc2626;
  }

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const HomeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: black;
  border: 1px solid grey;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #e1e1e2;
  }

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ButtonDiv = styled.div<{ $isRetry: boolean }>`
  display: flex;
  justify-content: space-between;
  width: ${({ $isRetry }) => ($isRetry ? '240px' : 'auto')};
`;

interface Props {
  onRetry?: () => void;
}

const Error500 = ({ onRetry }: Props) => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Icon />
      <Title>문제가 발생했어요 😢</Title>
      <Message>
        서버와의 연결에 문제가 발생했거나, 요청을 처리하지 못했습니다. <br />
        잠시 후 다시 시도해 주세요.
      </Message>
      <ButtonDiv $isRetry={!!onRetry}>
        {onRetry && <RetryButton onClick={onRetry}>다시 시도하기</RetryButton>}
        <HomeButton onClick={() => navigate('/')}>홈으로</HomeButton>
      </ButtonDiv>
    </Wrapper>
  );
};

export default Error500;
