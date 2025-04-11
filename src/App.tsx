import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { lightTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Router from './routes/Router';
import { Toaster } from '@/components/ui/toaster';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { useGlobalMessageAlert } from './hooks/useGlobalMessageAlert';
function App() {
  useGlobalMessageAlert(); // 한 번만 실행되면 됨

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter basename="/my-bnb">
        <ConfirmProvider>
          <GlobalStyle />
          <Router />
          <Toaster />
        </ConfirmProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
