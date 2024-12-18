import { useEffect, useState } from 'react';
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
  Text,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaSun, FaMoon, FaBell } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { messageAPI } from '../../services/messageAPI';

const Navbar = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout, user } = useAuth();
  const { unreadMessages, markAsRead } = useNotifications();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const fetchUnreadMessages = async () => {
    try {
      const messages = await messageAPI.getUnreadMessages();
      setUnreadNotifications(messages);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadMessages();
    }
  }, [user, unreadMessages]);

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleNotificationItemClick = async (notificationId) => {
    try {
      setUnreadNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      markAsRead();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await messageAPI.markMessagesAsRead();
      markAsRead();
      setUnreadNotifications([]);
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
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
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaBell />}
                  variant="ghost"
                  onClick={handleNotificationClick}
                />
                <MenuList maxH="300px" overflowY="auto">
                  {unreadNotifications.length > 0 ? (
                    <>
                      <MenuItem onClick={handleMarkAllAsRead}>
                        Marquer tout comme lu
                      </MenuItem>
                      {unreadNotifications.map((notification) => (
                        <MenuItem 
                          key={notification._id}
                          as={RouterLink}
                          to="/profile?tab=messages"
                          onClick={() => handleNotificationItemClick(notification._id)}
                        >
                          <Flex direction="column">
                            <Text fontWeight="bold">
                              {notification.from.displayName}
                            </Text>
                            <Text fontSize="sm">
                              {notification.content}
                            </Text>
                            {notification.housingId && (
                              <Text fontSize="xs" color="gray.500">
                                {notification.housingId.title}
                              </Text>
                            )}
                          </Flex>
                        </MenuItem>
                      ))}
                    </>
                  ) : (
                    <MenuItem>Aucune notification</MenuItem>
                  )}
                </MenuList>
              </Menu>
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