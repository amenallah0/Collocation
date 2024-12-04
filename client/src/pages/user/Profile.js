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
  useColorModeValue,
  Center,
  Spinner,
  IconButton
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import HousingCard from '../housing/HousingCard';
import { userService } from '../../services/user.service';
import { CloseIcon } from '@chakra-ui/icons';
import { housingAPI } from '../../services/api';
import { FaEdit } from 'react-icons/fa';
import {
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
} from '@chakra-ui/react';

const Profile = () => {
  const { user, loading, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // États
  const [myListings, setMyListings] = useState([]);
  const [favorites, setFavorites] = useState([]);
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

  // Couleurs adaptatives
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  // Ajouter ces états
  const [editingHousing, setEditingHousing] = useState(null);
  const { isOpen: isEditHousingOpen, onOpen: onEditHousingOpen, onClose: onEditHousingClose } = useDisclosure();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      
      updateUser({
        ...user,
        ...updatedUser
      });

      toast({
        title: 'Succès',
        description: 'Profil mis à jour avec succès',
        status: 'success',
        duration: 3000,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDeleteListing = async (listingId, e) => {
    // Empêcher la propagation du clic pour ne pas naviguer vers la page de détail
    e.stopPropagation();
    
    try {
      await housingAPI.delete(listingId);
      setMyListings(prevListings => 
        prevListings.filter(listing => listing._id !== listingId)
      );
      toast({
        title: 'Succès',
        description: 'Annonce supprimée avec succès',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleListingClick = (listingId) => {
    navigate(`/housings/${listingId}`);
  };

  // Ajouter cette fonction pour gérer l'ouverture du modal d'édition
  const handleEditHousing = (e, housing) => {
    e.stopPropagation(); // Empêcher la navigation vers la page de détail
    setEditingHousing(housing);
    onEditHousingOpen();
  };

  // Ajouter cette fonction pour gérer les modifications
  const handleHousingChange = (name, value) => {
    setEditingHousing(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Modifier la fonction handleSaveHousing
  const handleSaveHousing = async () => {
    try {
      const updatedData = {
        title: editingHousing.title,
        description: editingHousing.description,
        price: Number(editingHousing.price),
        surface: Number(editingHousing.surface),
        bedrooms: Number(editingHousing.bedrooms),
        type: editingHousing.type,
        location: editingHousing.location
      };

      console.log('Données à mettre à jour:', updatedData);
      console.log('ID de l\'annonce:', editingHousing._id);

      const response = await housingAPI.update(editingHousing._id, updatedData);
      console.log('Réponse de l\'API après mise à jour:', response);

      // Mettre à jour la liste avec les nouvelles données
      setMyListings(prevListings =>
        prevListings.map(listing =>
          listing._id === editingHousing._id ? response : listing
        )
      );

      // Recharger les données après la mise à jour
      await loadUserData();

      toast({
        title: 'Succès',
        description: 'Annonce mise à jour avec succès',
        status: 'success',
        duration: 3000,
      });
      
      onEditHousingClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Impossible de mettre à jour l\'annonce',
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <Spinner size="xl" />
        </Center>
      </Container>
    );
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
                    <Box 
                      key={listing._id} 
                      position="relative" 
                      onClick={() => handleListingClick(listing._id)}
                      cursor="pointer"
                    >
                      <HStack
                        position="absolute"
                        top={2}
                        right={2}
                        zIndex={2}
                        spacing={2}
                      >
                        <IconButton
                          icon={<FaEdit />}
                          colorScheme="blue"
                          size="sm"
                          onClick={(e) => handleEditHousing(e, listing)}
                          aria-label="Modifier l'annonce"
                        />
                        <CloseIcon
                          color="red.500"
                          bg="white"
                          rounded="full"
                          p={1}
                          w={6}
                          h={6}
                          cursor="pointer"
                          onClick={(e) => handleDeleteListing(listing._id, e)}
                          _hover={{ bg: 'red.50' }}
                        />
                      </HStack>
                      <HousingCard housing={listing} />
                    </Box>
                  ))
                ) : (
                  <Text>Vous n'avez pas encore d'annonces</Text>
                )}
              </SimpleGrid>

              {/* Ajouter le modal d'édition */}
              <Modal isOpen={isEditHousingOpen} onClose={onEditHousingClose} size="xl">
                <ModalOverlay />
                <ModalContent bg={bgColor}>
                  <ModalHeader color={textColor}>Modifier l'annonce</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                    {editingHousing && (
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel color={labelColor}>Titre</FormLabel>
                          <Input
                            value={editingHousing.title}
                            onChange={(e) => handleHousingChange('title', e.target.value)}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel color={labelColor}>Description</FormLabel>
                          <Textarea
                            value={editingHousing.description}
                            onChange={(e) => handleHousingChange('description', e.target.value)}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel color={labelColor}>Prix</FormLabel>
                          <NumberInput
                            value={editingHousing.price}
                            onChange={(value) => handleHousingChange('price', value)}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel color={labelColor}>Surface (m²)</FormLabel>
                          <NumberInput
                            value={editingHousing.surface}
                            onChange={(value) => handleHousingChange('surface', value)}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel color={labelColor}>Nombre de chambres</FormLabel>
                          <NumberInput
                            value={editingHousing.bedrooms}
                            onChange={(value) => handleHousingChange('bedrooms', value)}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel color={labelColor}>Type</FormLabel>
                          <Select
                            value={editingHousing.type}
                            onChange={(e) => handleHousingChange('type', e.target.value)}
                          >
                            <option value="house">Maison</option>
                            <option value="apartment">Appartement</option>
                            <option value="studio">Studio</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel color={labelColor}>Localisation</FormLabel>
                          <Input
                            value={editingHousing.location}
                            onChange={(e) => handleHousingChange('location', e.target.value)}
                          />
                        </FormControl>

                        <Button
                          colorScheme="blue"
                          width="100%"
                          onClick={handleSaveHousing}
                        >
                          Sauvegarder les modifications
                        </Button>
                      </VStack>
                    )}
                  </ModalBody>
                </ModalContent>
              </Modal>
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