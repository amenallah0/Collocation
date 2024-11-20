import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  SimpleGrid,
  Box,
  Avatar,
  Text,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';  // Mise à jour du chemin d'importimport { housingAPI, userAPI } from '../../services/api';
import HousingCard from '../housing/HousingCard';
import { userService } from '../../services/user.service';

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading, updateUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Ajout des états pour les annonces et favoris
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fonction pour charger les données de l'utilisateur
  const loadUserData = async () => {
    if (!user?._id) return;

    try {
      const data = await userService.getUserData(user._id);
      setMyListings(data.housings || []);
      setFavorites(data.favorites || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const [profileData, setProfileData] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    return {
      username: storedUser.displayName || '',
      firstName: storedUser.firstName || '',
      lastName: storedUser.lastName || '',
      email: storedUser.email || '',
      phone: storedUser.phone || ''
    };
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.displayName || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const userId = user?._id;
      if (!userId) {
        toast({
          title: 'Erreur',
          description: 'Session expirée. Veuillez vous reconnecter.',
          status: 'error',
          duration: 5000,
        });
        return;
      }

      const updatedUser = await userService.updateProfile(userId, profileData);
      
      // Mise à jour du contexte utilisateur
      updateUser({
        ...user,
        ...updatedUser
      });

      // Mise à jour du localStorage
      const storedUser = JSON.parse(localStorage.getItem('userData'));
      localStorage.setItem('userData', JSON.stringify({
        ...storedUser,
        ...updatedUser
      }));

      toast({
        title: 'Succès',
        description: 'Profil mis à jour avec succès',
        status: 'success',
        duration: 3000,
      });
      
      onClose(); // Fermer le modal
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Couleurs adaptatives
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  // Gestionnaire de changement des inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Afficher un loader pendant la vérification de l'authentification
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box>Chargement...</Box>
      </Container>
    );
  }

  // Ne rien rendre si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box 
          p={6} 
          borderWidth="1px" 
          borderRadius="lg" 
          bg={bgColor}
          borderColor={borderColor}
        >
          <HStack spacing={8} align="flex-start">
            <Avatar 
              size="2xl" 
              name={profileData.username || user.displayName} 
              src={user.photoURL || undefined} 
            />
            <VStack align="stretch" flex={1} spacing={4}>
              <Heading size="lg" color={textColor}>{profileData.username}</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="bold" color={labelColor}>Prénom</Text>
                  <Text color={textColor}>{profileData.firstName || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color={labelColor}>Nom</Text>
                  <Text color={textColor}>{profileData.lastName || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color={labelColor}>Email</Text>
                  <Text color={textColor}>{profileData.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color={labelColor}>Téléphone</Text>
                  <Text color={textColor}>{profileData.phone || '-'}</Text>
                </Box>
              </SimpleGrid>
              <Button colorScheme="blue" size="sm" onClick={onOpen} alignSelf="flex-start">
                Modifier le profil
              </Button>
            </VStack>
          </HStack>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader color={textColor}>Modifier le profil</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color={labelColor}>Nom d'utilisateur</FormLabel>
                  <Input
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={labelColor}>Prénom</FormLabel>
                  <Input
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={labelColor}>Nom</FormLabel>
                  <Input
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={labelColor}>Email</FormLabel>
                  <Input
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    type="email"
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color={labelColor}>Téléphone</FormLabel>
                  <Input
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                  />
                </FormControl>
                <Button
                  colorScheme="blue"
                  width="100%"
                  onClick={handleUpdateProfile}
                >
                  Sauvegarder
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Tabs colorScheme="blue" isFitted>
          <TabList>
            <Tab color={textColor}>Mes annonces</Tab>
            <Tab color={textColor}>Favoris</Tab>
            <Tab color={textColor}>Messages</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {myListings.length > 0 ? (
                  myListings.map(listing => (
                    <HousingCard key={listing._id} housing={listing} />
                  ))
                ) : (
                  <Text>Vous n'avez pas encore d'annonces</Text>
                )}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {favorites.length > 0 ? (
                  favorites.map(favorite => (
                    <HousingCard key={favorite._id} housing={favorite} />
                  ))
                ) : (
                  <Text>Vous n'avez pas encore de favoris</Text>
                )}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <Text>Fonctionnalité messages à venir</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default Profile;