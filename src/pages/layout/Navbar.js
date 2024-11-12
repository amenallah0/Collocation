import { Box, Flex, Button, useColorMode, IconButton } from '@chakra-ui/react';
import { FaSun, FaMoon, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();

  return (
    <Box px={4} shadow="base">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Link to="/">
          <Box fontSize="xl" fontWeight="bold">Collocation</Box>
        </Link>

        <Flex alignItems="center" gap={4}>
          <IconButton
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          
          {user ? (
            <>
              <Link to="/create-listing">
                <Button variant="outline">Publier une annonce</Button>
              </Link>
              <Link to="/profile">
                <IconButton icon={<FaUser />} variant="ghost" />
              </Link>
              <Button onClick={logout}>Déconnexion</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button>Inscription</Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;