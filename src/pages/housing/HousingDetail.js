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
  Textarea
} from '@chakra-ui/react';
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { housingAPI, messageAPI } from '../../services/api';
import Map from '../common/Map';
import { useAuth } from '../../hooks/useAuth';

const HousingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [housing, setHousing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchHousing = async () => {
      try {
        const data = await housingAPI.getHousingById(id);
        setHousing(data);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger l\'annonce',
          status: 'error',
          duration: 5000,
        });
        navigate('/'); // Redirection vers la page d'accueil en cas d'erreur
      } finally {
        setLoading(false);
      }
    };
    fetchHousing();
  }, [id, toast, navigate]);
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box>Chargement...</Box>
      </Container>
    );
  }

  if (!housing) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box>Annonce non trouvée</Box>
      </Container>
    );
  }

  const handleSendMessage = async () => {
    try {
      await messageAPI.sendMessage({
        from: user.uid,
        to: housing.userId,
        housingId: id,
        content: message,
      });
      toast({
        title: 'Succès',
        description: 'Message envoyé avec succès',
        status: 'success',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        status: 'error',
      });
    }
  };

  if (!housing) return <Box>Chargement...</Box>;

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <Box>
          <Image
            src={housing.images[0]}
            alt={housing.title}
            borderRadius="lg"
            mb={4}
          />
          <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
            {housing.images.slice(1).map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${housing.title} ${index + 2}`}
                borderRadius="md"
                cursor="pointer"
                onClick={() => {/* Logique pour afficher l'image en grand */}}
              />
            ))}
          </Grid>

          <VStack align="stretch" spacing={4}>
            <Heading>{housing.title}</Heading>
            <HStack>
              <Badge colorScheme="blue">{housing.type}</Badge>
              <Badge colorScheme={housing.isActive ? 'green' : 'red'}>
                {housing.isActive ? 'Disponible' : 'Indisponible'}
              </Badge>
            </HStack>
            <Text fontSize="2xl" color="blue.500" fontWeight="bold">
              {housing.price}€/mois
            </Text>
            <Text>{housing.description}</Text>
          </VStack>
        </Box>

        <VStack spacing={4}>
          <Box w="100%" p={4} borderWidth={1} borderRadius="lg">
            <VStack spacing={3}>
              <Heading size="md">Informations</Heading>
              <HStack>
                <FaMapMarkerAlt />
                <Text>{housing.location}</Text>
              </HStack>
              <Text>Surface: {housing.surface}m²</Text>
              <Text>Chambres: {housing.bedrooms}</Text>
            </VStack>
          </Box>

          <Box w="100%" h="300px">
            <Map location={housing.coordinates} />
          </Box>

          <Button
            leftIcon={<FaEnvelope />}
            colorScheme="blue"
            w="100%"
            onClick={onOpen}
          >
            Contacter le propriétaire
          </Button>
        </VStack>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Envoyer un message</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
            />
            <Button
              mt={4}
              colorScheme="blue"
              onClick={handleSendMessage}
              isDisabled={!message.trim()}
            >
              Envoyer
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default HousingDetail;