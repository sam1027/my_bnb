import { ThemeProvider } from 'styled-components';
import { lightTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Router from './routes/Router';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
