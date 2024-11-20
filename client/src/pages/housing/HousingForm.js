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
import { useAuth } from '../../context/AuthContext';
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
    isActive: true,
    createdAt: new Date(),
    images: []
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('[Form] Starting submission with:', formData);
    console.log('[Form] Current user:', user);

    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const data = {
        ...formData,
        userId: user.userId || user._id,
        price: Number(formData.price) || 0,
        surface: Number(formData.surface) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        createdAt: new Date().toISOString()
      };

      console.log('[Form] Prepared data:', data);

      const response = await (id ? 
        housingAPI.update(id, data, images.filter(img => img.file)) : 
        housingAPI.create(data, images.filter(img => img.file))
      );
      console.log('[Form] Submission success:', response.data);

      toast({
        title: 'Succès',
        description: id ? 'Annonce mise à jour' : 'Annonce créée',
        status: 'success',
        duration: 3000,
      });
      
      navigate('/housings/' + (response?.data?._id || id));
    } catch (error) {
      console.error('[Form] Submission error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack as="form" spacing={6} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Titre</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Titre de l'annonce"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type de bien</FormLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="house">Maison</option>
            <option value="room">Chambre</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Prix/mois (€)</FormLabel>
          <Input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Surface (m²)</FormLabel>
          <Input
            name="surface"
            type="number"
            value={formData.surface}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Localisation</FormLabel>
          <Input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Ville ou quartier"
          />
        </FormControl>

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