import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './pages/layout/Navbar';
import Routes from './Routes';
import { AuthProvider as AuthContextProvider } from './context/AuthContext';
import theme from './styles/theme';


function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <AuthContextProvider>
            <NavBar />
            <Routes />
        </AuthContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;