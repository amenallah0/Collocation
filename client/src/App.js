import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './pages/layout/Navbar';
import Routes from './Routes';
import { AuthProvider as AuthContextProvider } from './context/AuthContext';
import theme from './styles/theme';
import { NotificationProvider } from './context/NotificationContext';


function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthContextProvider>
        <NotificationProvider>
            <NavBar />
            <Routes />
          </NotificationProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;