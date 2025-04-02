import { ThemeProvider } from 'styled-components';
import { lightTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Router from './routes/Router';
import { Toaster } from '@/components/ui/toaster';
import { ConfirmProvider } from './contexts/ConfirmContext';
function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <ConfirmProvider>
        <GlobalStyle />
        <Router />
        <Toaster />
      </ConfirmProvider>
    </ThemeProvider>
  );
}

export default App;
