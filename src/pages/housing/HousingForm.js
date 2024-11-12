import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Button,
  SimpleGrid,
  Image,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FaTrash, FaUpload } from 'react-icons/fa';
import { housingAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Map from '../common/Map';

const HousingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'house',
    price: '',
    surface: '',
    bedrooms: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    isActive: true
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchHousing = async () => {
        try {
          const data = await housingAPI.getHousingById(id);
          setFormData(data);
          setImages(data.images || []);
        } catch (error) {
          toast({
            title: 'Erreur',
            description: 'Impossible de charger l\'annonce',
            status: 'error',
          });
        }
      };
      fetchHousing();
    }
  }, [id, toast]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages([...images, ...newImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        userId: user.uid,
        updatedAt: new Date()
      };

      if (id) {
        await housingAPI.updateHousing(id, data);
      } else {
        await housingAPI.createHousing(data, images.map(img => img.file));
      }

      toast({
        title: 'Succès',
        description: id ? 'Annonce mise à jour' : 'Annonce créée',
        status: 'success',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        status: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack as="form" spacing={6} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Titre</FormLabel>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type de bien</FormLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
          >
            <option value="house">Maison</option>
            <option value="room">Chambre</option>
          </Select>
        </FormControl>

        <SimpleGrid columns={2} spacing={4} w="100%">
          <FormControl isRequired>
            <FormLabel>Prix/mois (€)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </NumberInput>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Surface (m²)</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                value={formData.surface}
                onChange={(e) => setFormData({...formData, surface: e.target.value})}
              />
            </NumberInput>
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Images</FormLabel>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            display="none"
            id="image-upload"
          />
          <Button
            as="label"
            htmlFor="image-upload"
            leftIcon={<FaUpload />}
            cursor="pointer"
          >
            Ajouter des images
          </Button>
        </FormControl>

        <SimpleGrid columns={3} spacing={4} w="100%">
          {images.map((image, index) => (
            <Box key={index} position="relative">
              <Image
                src={image.preview || image}
                alt={`Image ${index + 1}`}
                borderRadius="md"
              />
              <IconButton
                icon={<FaTrash />}
                position="absolute"
                top={2}
                right={2}
                size="sm"
                onClick={() => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                }}
              />
            </Box>
          ))}
        </SimpleGrid>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          w="100%"
          isLoading={loading}
        >
          {id ? 'Mettre à jour l\'annonce' : 'Publier l\'annonce'}
        </Button>
      </VStack>
    </Container>
  );
};

export default HousingForm;