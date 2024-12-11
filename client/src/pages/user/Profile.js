import { useState, useEffect, useRef } from 'react';
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
  IconButton,
  Badge,
  Divider,
  Icon,
  Flex,
  ModalFooter,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import HousingCard from '../housing/HousingCard';
import { userService } from '../../services/user.service';
import { CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { housingAPI } from '../../services/api';
import { FaEdit, FaEnvelope, FaClock, FaHome, FaTrash } from 'react-icons/fa';
import {
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { messageAPI } from '../../services/messageAPI';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
}); // Remplacez par l'URL de votre serveur

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
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messageContainerRef = useRef(null);

  // États pour les dialogues de confirmation
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isMessageAlertOpen, setIsMessageAlertOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [conversationToDelete, setConversationToDelete] = useState(null);

  const cancelRef = useRef();

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

  const handleFavoriteToggle = async (housingId) => {
    try {
      await housingAPI.toggleFavorite(housingId);
      // Recharger les favoris
      loadUserData();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Modifier l'useEffect pour les messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      
      try {
        const data = await messageAPI.getUserMessages();
        setMessages(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();

    // Écouter les nouveaux messages
    socket.on('newMessage', (newMessage) => {
      setMessages(prevMessages => {
        // Vérifier si le message existe déjà
        const messageExists = prevMessages.some(msg => 
          msg._id === newMessage._id || 
          (msg.content === newMessage.content && 
           msg.from._id === newMessage.from._id && 
           msg.createdAt === newMessage.createdAt)
        );

        if (messageExists) {
          return prevMessages;
        }

        const updatedMessages = [...prevMessages, newMessage];
        
        // Mettre à jour la conversation sélectionnée si nécessaire
        if (selectedConversation) {
          const isRelevantMessage = 
            newMessage.from._id === selectedConversation.user._id || 
            newMessage.to._id === selectedConversation.user._id;

          if (isRelevantMessage) {
            const conversations = groupMessagesByConversation(updatedMessages);
            const updatedConversation = conversations.find(
              conv => conv.user._id === selectedConversation.user._id
            );
            if (updatedConversation) {
              setSelectedConversation(updatedConversation);
            }
          }
        }

        // Faire défiler vers le bas si nécessaire
        if (shouldScrollToBottom) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        
        return updatedMessages;
      });
    });

    // Nettoyage
    return () => {
      socket.off('newMessage');
    };
  }, [user, selectedConversation, shouldScrollToBottom]);

  // Ajouter un useEffect séparé pour mettre à jour la conversation sélectionnée
  useEffect(() => {
    if (selectedConversation && messages.length > 0) {
      const conversations = groupMessagesByConversation(messages);
      const updatedConversation = conversations.find(
        conv => conv.user._id === selectedConversation.user._id
      );
      if (updatedConversation) {
        setSelectedConversation(updatedConversation);
      }
    }
  }, [messages, selectedConversation?.user._id]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days === 1) {
      return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  // Fonction pour grouper les messages par conversation
  const groupMessagesByConversation = (messages) => {
    const conversations = {};
    
    messages.forEach(msg => {
      const otherId = msg.from._id === user._id ? msg.to._id : msg.from._id;
      const otherUser = msg.from._id === user._id ? msg.to : msg.from;
      
      if (!conversations[otherId]) {
        conversations[otherId] = {
          user: otherUser,
          messages: [],
          lastMessage: null,
          housing: msg.housingId
        };
      }
      
      conversations[otherId].messages.push(msg);
      
      if (!conversations[otherId].lastMessage || 
          new Date(msg.createdAt) > new Date(conversations[otherId].lastMessage.createdAt)) {
        conversations[otherId].lastMessage = msg;
      }
    });

    // Log pour debug
    console.log('Grouped conversations:', conversations);
    
    return Object.values(conversations);
  };

  const handleOpenConversation = (conversation) => {
    if (conversation && conversation.messages.length > 0) {
      const housing = conversation.housing || conversation.messages[0].housingId;
      setSelectedConversation({
        ...conversation,
        housing
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseConversation = () => {
    setIsModalOpen(false);
    setSelectedConversation(null);
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const messageData = {
        to: selectedConversation.user._id,
        housingId: selectedConversation.housing?._id || selectedConversation.messages[0].housingId._id,
        content: replyContent,
      };

      // Envoyer le message via l'API
      await messageAPI.sendMessage(messageData);
      
      setReplyContent('');
      setShouldScrollToBottom(true);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const scrollToBottom = () => {
    if (shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Gérer le défilement manuel
  const handleScroll = (e) => {
    const element = e.target;
    const isScrolledNearBottom = 
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    
    setShouldScrollToBottom(isScrolledNearBottom);
  };

  // Effet pour le défilement automatique lors de nouveaux messages
  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
    }
  }, [selectedConversation?.messages]);

  // Ajouter la gestion de la suppression des messages
  const handleDeleteMessage = async (messageId, e) => {
    e.stopPropagation();
    setMessageToDelete(messageId);
    setIsMessageAlertOpen(true);
  };

  const confirmDeleteMessage = async () => {
    try {
      await messageAPI.deleteMessage(messageToDelete);
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== messageToDelete)
      );
      if (selectedConversation) {
        setSelectedConversation(prev => ({
          ...prev,
          messages: prev.messages.filter(msg => msg._id !== messageToDelete)
        }));
      }
      toast({
        title: 'Succès',
        description: 'Message supprimé avec succès',
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
    } finally {
      setIsMessageAlertOpen(false);
    }
  };

  // Ajouter l'écouteur pour les messages supprimés
  useEffect(() => {
    socket.on('messageDeleted', (messageId) => {
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg._id !== messageId)
      );

      if (selectedConversation) {
        setSelectedConversation(prev => ({
          ...prev,
          messages: prev.messages.filter(msg => msg._id !== messageId)
        }));
      }
    });

    return () => {
      socket.off('messageDeleted');
    };
  }, [selectedConversation]);

  // Ajouter la fonction de suppression de conversation
  const handleDeleteConversation = async (conversationUserId, e) => {
    e.stopPropagation(); // Empêcher l'ouverture de la conversation
    setConversationToDelete(conversationUserId);
    setIsAlertOpen(true);
  };

  const confirmDeleteConversation = async () => {
    try {
      await messageAPI.deleteConversation(conversationToDelete);
      setMessages(prevMessages => 
        prevMessages.filter(msg => 
          msg.from._id !== conversationToDelete && msg.to._id !== conversationToDelete
        )
      );
      toast({
        title: 'Succès',
        description: 'Conversation supprimée avec succès',
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
    } finally {
      setIsAlertOpen(false);
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

        <Tabs colorScheme="blue" isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab color={textColor}>Mes annonces</Tab>
            <Tab color={textColor}>Favoris</Tab>
            <Tab>
              <HStack>
                <Icon as={FaEnvelope} />
                <Text>Messages</Text>
                {messages.length > 0 && (
                  <Badge colorScheme="blue" borderRadius="full">
                    {messages.length}
                  </Badge>
                )}
              </HStack>
            </Tab>
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
                    <HousingCard 
                      key={favorite._id} 
                      housing={favorite} 
                      isFavorite={true}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
                  ))
                ) : (
                  <Text>Vous n'avez pas encore de favoris</Text>
                )}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <Box>
                <Heading size="lg" mb={6}>Mes Conversations</Heading>
                {messagesLoading ? (
                  <Center p={8}>
                    <Spinner size="xl" />
                  </Center>
                ) : messages.length === 0 ? (
                  <Box 
                    p={8} 
                    textAlign="center" 
                    borderWidth={1} 
                    borderRadius="lg"
                    borderStyle="dashed"
                  >
                    <Icon as={FaEnvelope} w={10} h={10} color="gray.400" mb={4} />
                    <Text fontSize="lg" color="gray.500">
                      Aucun message pour le moment
                    </Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {groupMessagesByConversation(messages).map((conversation) => (
                      <Flex
                        key={conversation.user._id}
                        p={4}
                        borderWidth={1}
                        borderRadius="lg"
                        bg={bgColor}
                        borderColor={borderColor}
                        _hover={{ shadow: 'md' }}
                        transition="all 0.2s"
                        justify="space-between"
                        align="center"
                      >
                        <HStack spacing={4} flex={1} onClick={() => handleOpenConversation(conversation)} cursor="pointer">
                          <Avatar 
                            size="md" 
                            name={conversation.user.displayName}
                            src={conversation.user.photoURL}
                          />
                          <Box>
                            <Text fontWeight="bold" fontSize="lg">
                              {conversation.user.displayName}
                            </Text>
                            <HStack spacing={2} color={labelColor}>
                              <Icon as={FaHome} />
                              <Text fontSize="sm">
                                {conversation.housing ? (
                                  conversation.housing.title || 'Titre non disponible'
                                ) : (
                                  'Annonce non disponible'
                                )}
                              </Text>
                            </HStack>
                          </Box>
                        </HStack>
                        <HStack spacing={4}>
                          <Text fontSize="sm" color={labelColor}>
                            {formatDate(conversation.lastMessage.createdAt)}
                          </Text>
                          <IconButton
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteConversation(conversation.user._id, e)}
                            aria-label="Supprimer la conversation"
                          />
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                )}
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {selectedConversation && (
          <Modal 
            isOpen={isModalOpen} 
            onClose={handleCloseConversation}
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent maxH="80vh">
              <ModalHeader>
                Discussion avec {selectedConversation.user.displayName}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody 
                ref={messageContainerRef}
                onScroll={handleScroll}
                overflowY="auto" 
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'gray.300',
                    borderRadius: '24px',
                  },
                }}
              >
                <VStack spacing={3} align="stretch" maxH="calc(70vh - 120px)">
                  {selectedConversation.messages.map((msg) => (
                    <Flex
                      key={`${msg._id}-${msg.createdAt}`}
                      justify={msg.from._id === user._id ? 'flex-end' : 'flex-start'}
                      position="relative"
                      role="group"
                    >
                      <Box
                        position="relative"
                        maxW="80%"
                        p={3}
                        borderRadius="lg"
                        bg={msg.from._id === user._id ? 'blue.500' : 'gray.100'}
                        color={msg.from._id === user._id ? 'white' : 'gray.800'}
                        _hover={{ '& > button': { opacity: 1 } }}
                      >
                        {msg.from._id === user._id && (
                          <IconButton
                            icon={<DeleteIcon />}
                            size="xs"
                            position="absolute"
                            top="-10px"
                            right="-10px"
                            colorScheme="red"
                            borderRadius="full"
                            opacity={0}
                            transition="opacity 0.2s"
                            _hover={{ opacity: 1 }}
                            onClick={(e) => handleDeleteMessage(msg._id, e)}
                            aria-label="Supprimer le message"
                            zIndex={2}
                          />
                        )}
                        <Text>{msg.content}</Text>
                        <Text 
                          fontSize="xs" 
                          opacity={0.8}
                          textAlign="right"
                          mt={1}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                  <div ref={messagesEndRef} />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Input
                  placeholder="Écrire un message..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  mr={3}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                />
                <Button colorScheme="blue" onClick={handleReply}>
                  Envoyer
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Dialogues de confirmation */}
        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsAlertOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Supprimer la conversation
              </AlertDialogHeader>
              <AlertDialogBody>
                Êtes-vous sûr de vouloir supprimer cette conversation ?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                  Annuler
                </Button>
                <Button colorScheme="red" onClick={confirmDeleteConversation} ml={3}>
                  Supprimer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={isMessageAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsMessageAlertOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Supprimer le message
              </AlertDialogHeader>
              <AlertDialogBody>
                Êtes-vous sûr de vouloir supprimer ce message ?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsMessageAlertOpen(false)}>
                  Annuler
                </Button>
                <Button colorScheme="red" onClick={confirmDeleteMessage} ml={3}>
                  Supprimer
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Container>
  );
};

export default Profile;