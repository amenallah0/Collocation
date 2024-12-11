import { 
  Box, 
  Flex, 
  Button, 
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaSun, FaMoon, FaUser, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout, user } = useAuth();
  const { unreadMessages, markAsRead } = useNotifications();

  const handleLogout = async () => {
    try {
      await logout();
      // La redirection se fera automatiquement via le contexte d'authentification
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <Box px={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box as={RouterLink} to="/" fontWeight="bold" fontSize="xl">
          CoLocation
        </Box>

        <Flex alignItems="center" gap={4}>
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
            variant="ghost"
          />

          {user && (
            <Box position="relative">
              <IconButton
                as={RouterLink}
                to="/profile"
                icon={<FaBell />}
                variant="ghost"
                onClick={markAsRead}
              />
              {unreadMessages > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  colorScheme="red"
                  borderRadius="full"
                  minW="1.5em"
                  textAlign="center"
                >
                  {unreadMessages}
                </Badge>
              )}
            </Box>
          )}

          {user ? (
            <>
              <Button
                as={RouterLink}
                to="/housing/create"
                colorScheme="blue"
              >
                Publier une annonce
              </Button>

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<Avatar size="sm" name={user.displayName} src={user.photoURL} />}
                  variant="ghost"
                />
                <MenuList>
                  <MenuItem as={RouterLink} to="/profile">
                    Mon profil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Déconnexion
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/login" variant="ghost">
                Connexion
              </Button>
              <Button as={RouterLink} to="/register" colorScheme="blue">
                Inscription
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;