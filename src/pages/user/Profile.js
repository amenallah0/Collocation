import { useState, useEffect } from 'react';
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
  HStack
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { housingAPI, userAPI } from '../../services/api';
import HousingCard from '../housing/HousingCard';

const Profile = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const toast = useToast();
  const [profileData, setProfileData] = useState({
    username: user.displayName || '',
    firstName: '',
    lastName: '',
    email: user.email || '',
    phone: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const listings = await housingAPI.getUserListings(user.uid);
        const favs = await housingAPI.getUserFavorites(user.uid);
        const userData = await userAPI.getUserProfile(user.uid);
        setMyListings(listings);
        setFavorites(favs);
        if (userData) {
          setProfileData(prev => ({
            ...prev,
            ...userData
          }));
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger vos données',
          status: 'error',
        });
      }
    };
    fetchUserData();
  }, [user.uid, toast]);

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
        title: 'Succès',
        description: 'Profil mis à jour avec succès',
        status: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
        status: 'error',
      });
    }
  };

  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
          <HStack spacing={8} align="flex-start">
            <Avatar size="2xl" name={profileData.username} src={user.photoURL} />
            <VStack align="stretch" flex={1} spacing={4}>
              <Heading size="lg">{profileData.username}</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="bold">Prénom</Text>
                  <Text>{profileData.firstName || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Nom</Text>
                  <Text>{profileData.lastName || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Email</Text>
                  <Text>{profileData.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Téléphone</Text>
                  <Text>{profileData.phone || '-'}</Text>
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
          <ModalContent>
            <ModalHeader>Modifier le profil</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <Input
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Prénom</FormLabel>
                  <Input
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Nom</FormLabel>
                  <Input
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    type="email"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Téléphone</FormLabel>
                  <Input
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    type="tel"
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
            <Tab>Mes annonces</Tab>
            <Tab>Favoris</Tab>
            <Tab>Messages</Tab>
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