import { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  VStack,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  SimpleGrid,
  Icon,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { FaEnvelope, FaMapMarkerAlt, FaBed, FaRuler, FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { housingAPI } from '../../services/api';
import Map from '../common/Map';
import { useAuth } from '../../context/AuthContext';
import { mockHousings } from '../../data/mockHousings';
import { messageAPI } from '../../services/messageAPI';

const HousingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [housing, setHousing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const loadingBgColor = useColorModeValue('gray.100', 'gray.700');
  const modalBgColor = useColorModeValue('white', 'gray.700');
  const galleryBgColor = useColorModeValue('gray.50', 'gray.900');

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { 
    isOpen: isImageOpen, 
    onOpen: onImageOpen, 
    onClose: onImageClose 
  } = useDisclosure();

  const [isActive, setIsActive] = useState(housing?.isActive);

  const getImageUrl = (imagePath) => {
    return imagePath ? `http://localhost:5000${imagePath}` : 'https://via.placeholder.com/400x300?text=Pas+d%27image';
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? housing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === housing.images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const fetchHousing = async () => {
      try {
        setLoading(true);
        const response = await housingAPI.getHousingById(id);
        console.log('Housing details:', response.data);
        setHousing(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger l\'annonce',
          status: 'error',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHousing();
    }
  }, [id, toast]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isImageOpen) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        onImageClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isImageOpen]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box bg={loadingBgColor} p={4} borderRadius="lg" textAlign="center">
          Chargement...
        </Box>
      </Container>
    );
  }

  if (!housing) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box bg={loadingBgColor} p={4} borderRadius="lg" textAlign="center">
          Annonce non trouvée
        </Box>
      </Container>
    );
  }

  const handleSendMessage = async () => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour envoyer un message',
        status: 'error',
      });
      navigate('/login');
      return;
    }

    try {
      console.log('Sending message with data:', {
        to: housing.userId,
        housingId: housing._id,
        content: message
      });

      await messageAPI.sendMessage({
        to: housing.userId,
        housingId: housing._id,
        content: message
      });

      toast({
        title: 'Succès',
        description: 'Message envoyé avec succès',
        status: 'success',
        duration: 5000,
      });
      
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'envoyer le message',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const response = await housingAPI.updateAvailability(housing._id, !isActive);
      setIsActive(response.data.housing.isActive);
      toast({
        title: 'Succès',
        description: 'Disponibilité mise à jour avec succès',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Erreur lors de la mise à jour',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={12}>
      <Box 
        borderRadius="2xl" 
        overflow="hidden" 
        bg={bgColor} 
        boxShadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }}>
          <Box p={0} position="relative" height={{ base: "300px", md: "500px" }}>
            <Image
              src={getImageUrl(housing.images[0])}
              alt={housing.title}
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition="center"
            />
            <HStack 
              position="absolute" 
              top={4} 
              right={4} 
              spacing={2}
            >
              <Badge 
                colorScheme="blue" 
                fontSize="md" 
                px={3} 
                py={1} 
                borderRadius="full"
              >
                {housing.type}
              </Badge>
              <Badge 
                colorScheme={housing.isActive ? 'green' : 'red'} 
                fontSize="md" 
                px={3} 
                py={1} 
                borderRadius="full"
              >
                {housing.isActive ? 'Disponible' : 'Indisponible'}
              </Badge>
            </HStack>
          </Box>

          <Box p={8}>
            <VStack align="stretch" spacing={6}>
              <Heading size="xl" color={textColor}>{housing.title}</Heading>
              <Text 
                fontSize="3xl" 
                fontWeight="bold" 
                color={accentColor}
              >
                {housing.price}€<Text as="span" fontSize="lg">/mois</Text>
              </Text>

              <Box py={4} borderTopWidth="1px" borderBottomWidth="1px" borderColor={borderColor}>
                <SimpleGrid columns={3} spacing={4}>
                  <VStack>
                    <Icon as={FaBed} w={6} h={6} color={accentColor} />
                    <Text fontWeight="bold">{housing.bedrooms}</Text>
                    <Text fontSize="sm" color="gray.500">Chambres</Text>
                  </VStack>
                  <VStack>
                    <Icon as={FaRuler} w={6} h={6} color={accentColor} />
                    <Text fontWeight="bold">{housing.surface}m²</Text>
                    <Text fontSize="sm" color="gray.500">Surface</Text>
                  </VStack>
                  <VStack>
                    <Icon as={FaMapMarkerAlt} w={6} h={6} color={accentColor} />
                    <Text fontWeight="bold" noOfLines={1}>{housing.location}</Text>
                    <Text fontSize="sm" color="gray.500">Localisation</Text>
                  </VStack>
                </SimpleGrid>
              </Box>

              <Box>
                <Heading size="md" mb={4} color={textColor}>Description</Heading>
                <Text color={textColor}>{housing.description}</Text>
              </Box>

              {/* <Box>
                <Heading size="md" mb={4} color={textColor}>Localisation</Heading>
                <Box 
                  borderRadius="xl" 
                  overflow="hidden" 
                  h="250px"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Map location={housing.coordinates} />
                </Box>
              </Box> */}

              <Button
                leftIcon={<FaEnvelope />}
                colorScheme="blue"
                size="lg"
                onClick={onOpen}
                w="100%"
                py={7}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Contacter le propriétaire
              </Button>

              {user && housing && user._id === housing.userId && (
                <Button
                  leftIcon={isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                  colorScheme={isActive ? "green" : "red"}
                  onClick={handleAvailabilityToggle}
                  mt={4}
                  w="100%"
                >
                  {isActive ? "Marquer comme indisponible" : "Marquer comme disponible"}
                </Button>
              )}
            </VStack>
          </Box>
        </Grid>

        <Box p={8} bg={galleryBgColor}>
          <Heading size="md" mb={6}>Galerie photos</Heading>
          <Grid 
            templateColumns={{
              base: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            }}
            gap={4}
            sx={{
              '& > div': {
                position: 'relative',
                paddingBottom: '100%', // Aspect ratio 1:1
                overflow: 'hidden',
              },
              '& > div > img': {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease',
              },
              '& > div:hover > img': {
                transform: 'scale(1.05)',
              }
            }}
          >
            {housing.images.slice(1).map((img, index) => (
              <Box 
                key={index}
                borderRadius="xl"
                overflow="hidden"
                cursor="pointer"
                onClick={() => {
                  setSelectedImageIndex(index + 1);
                  onImageOpen();
                }}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${housing.title} ${index + 2}`}
                  loading="lazy"
                />
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg={bgColor}>
          <ModalHeader color={textColor}>Envoyer un message</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              minH="150px"
              bg={modalBgColor}
            />
            <Button
              mt={6}
              colorScheme="blue"
              onClick={handleSendMessage}
              isDisabled={!message.trim()}
              w="100%"
              size="lg"
            >
              Envoyer
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isImageOpen} onClose={onImageClose} size="6xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" zIndex="popover" />
          <ModalBody p={0} position="relative">
            <Image
              src={getImageUrl(housing.images[selectedImageIndex])}
              alt={`Image ${selectedImageIndex + 1}`}
              w="100%"
              h="auto"
              maxH="90vh"
              objectFit="contain"
            />
            
            <IconButton
              icon={<FaChevronLeft />}
              position="absolute"
              left={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={handlePrevImage}
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: "blackAlpha.800" }}
              size="lg"
              isRound
              aria-label="Image précédente"
            />
            
            <IconButton
              icon={<FaChevronRight />}
              position="absolute"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              onClick={handleNextImage}
              bg="blackAlpha.600"
              color="white"
              _hover={{ bg: "blackAlpha.800" }}
              size="lg"
              isRound
              aria-label="Image suivante"
            />
            
            <Text
              position="absolute"
              bottom={4}
              left="50%"
              transform="translateX(-50%)"
              color="white"
              bg="blackAlpha.600"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
            >
              {selectedImageIndex + 1} / {housing.images.length}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default HousingDetail;