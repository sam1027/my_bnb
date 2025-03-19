import React from 'react';
import * as L from '../styles/LayoutStyles';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <L.Container>
      <L.Header>
        <L.Nav>
          <L.Logo>MyApp</L.Logo>
          <L.NavLinks>
            <L.StyledLink to="/">홈</L.StyledLink>
            <L.Button onClick={() => {}}>로그아웃</L.Button>
            <L.Button onClick={() => {}}>로그인</L.Button>
          </L.NavLinks>
        </L.Nav>
      </L.Header>
      <L.Main>{children}</L.Main>
    </L.Container>
  );
};

export default Layout;
