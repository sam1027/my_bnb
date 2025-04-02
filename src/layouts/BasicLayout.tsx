import React from 'react';
import * as L from '../styles/LayoutStyles';
import { Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const BasicLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <L.Container>
      <L.Header>
        <L.Nav>
          <L.Logo to="/">My BNB</L.Logo>
          <L.NavLinks>
            <L.Button
              onClick={() => {
                navigate('/write');
              }}
            >
              New Room
            </L.Button>
            {/* <L.Button onClick={() => {}}>로그아웃</L.Button>
            <L.Button onClick={() => {}}>로그인</L.Button> */}
          </L.NavLinks>
        </L.Nav>
      </L.Header>
      <L.Main>{children}</L.Main>
    </L.Container>
  );
};

export default BasicLayout;
