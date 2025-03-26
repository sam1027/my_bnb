import { ClipLoader } from 'react-spinners';
import styled from 'styled-components';

interface IProps {
  isLoading?: boolean;
}

const SpinnerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 500px; // 또는 100vh 등으로 조정 가능
  background-color: rgba(255, 255, 255, 0.5); // 선택적 반투명 배경
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Spinner = ({ isLoading = true }: IProps) => {
  return (
    <SpinnerWrapper>
      <ClipLoader color="#2bc7d7" size={50} loading={isLoading} />
    </SpinnerWrapper>
  );
};

export default Spinner;
