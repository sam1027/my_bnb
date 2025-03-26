import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: ${({ theme }) => theme.bgColor};
    color: #212529;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
