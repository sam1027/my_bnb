import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Header = styled.header`
  background: ${({ theme }) => theme.bgColor};
  padding: 16px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Logo = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #333;

  &:hover {
    color: #007bff;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  font-size: 16px;
  color: #333;
  font-weight: 500;

  &:hover {
    color: #007bff;
  }
`;

export const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #0056b3;
  }
`;

export const Main = styled.main`
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
