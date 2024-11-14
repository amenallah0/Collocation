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
import { useAuth } from '../../hooks/useAuth';
import { housingAPI, userAPI } from '../../services/api';
import HousingCard from '../housing/HousingCard';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Définir tous les hooks d'état et de couleur avant les conditions
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Couleurs adaptatives pour le mode sombre
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialiser les données du profil quand l'utilisateur est disponible
    setProfileData({
      username: user.displayName || '',
      firstName: '',
      lastName: '',
      email: user.email || '',
      phone: ''
    });
  }, [user, navigate]);

  // Ne rendre le composant que si l'utilisateur est connecté
  if (!user) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      await userAPI.updateUserProfile(user.uid, profileData);
      toast({
        title: 'Profil mis à jour',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
            <Avatar size="2xl" name={profileData.username} src={user.photoURL} />
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
                {myListings.map(listing => (
                  <HousingCard key={listing.id} housing={listing} />
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {favorites.map(fav => (
                  <HousingCard key={fav.id} housing={fav} />
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <Box>
                {/* Composant Messages sera intégré ici */}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default Profile;