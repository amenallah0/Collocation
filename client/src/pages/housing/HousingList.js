import { useState, useEffect, useMemo } from 'react';
import {
  SimpleGrid,
  Container,
  Heading,
  Select,
  Input,
  HStack,
  Box,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  VStack,
  Collapse,
  Button,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import HousingCard from './HousingCard';
import { mockHousings } from '../../data/mockHousings';
import { housingAPI } from '../../services/api';
import { useToast,useColorModeValue } from '@chakra-ui/react';

const HousingList = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date');
  const [housings, setHousings] = useState([]);
  const toast = useToast();

  // Définir des constantes pour les valeurs max
  const MAX_PRICE = 200000;
  const MAX_SURFACE = 1000;

  // Initialiser les états avec les bonnes valeurs max
  const [tempFilters, setTempFilters] = useState({
    type: 'all',
    priceRange: [0, MAX_PRICE],
    surfaceRange: [0, MAX_SURFACE],
    bedrooms: '',
    governorate: 'all'
  });

  const [appliedFilters, setAppliedFilters] = useState({
    type: 'all',
    priceRange: [0, MAX_PRICE],
    surfaceRange: [0, MAX_SURFACE],
    bedrooms: '',
    governorate: 'all'
  });

  const governorates = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul',
    'Zaghouan', 'Bizerte', 'Béja', 'Jendouba', 'Le Kef',
    'Siliana', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Sousse',
    'Monastir', 'Mahdia', 'Sfax', 'Gafsa', 'Tozeur',
    'Kebili', 'Gabès', 'Medenine', 'Tataouine'
  ];

  const sortHousings = (housings, order) => {
    return [...housings].sort((a, b) => {
      switch (order) {
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  useEffect(() => {
    const fetchHousings = async () => {
      setLoading(true);
      try {
        const response = await housingAPI.getAll();
        console.log('API Response:', response);
        
        // Vérifier si response.data existe et est un tableau
        const housingsData = Array.isArray(response) ? response : response.data;
        
        // Formater les données
        const formattedHousings = housingsData.map(housing => ({
          _id: housing._id,
          title: housing.title || 'Sans titre',
          description: housing.description || '',
          type: housing.type || 'house',
          price: Number(housing.price) || 0,
          surface: Number(housing.surface) || 0,
          bedrooms: Number(housing.bedrooms) || 0,
          location: housing.location || '',
          images: Array.isArray(housing.images) ? housing.images : [],
          createdAt: new Date(housing.createdAt)
        }));

        console.log('Formatted housings:', formattedHousings);
        setHousings(formattedHousings);
      } catch (error) {
        console.error('Error fetching housings:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les annonces',
          status: 'error',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHousings();
  }, [toast]);

  const resetFilters = () => {
    const defaultFilters = {
      type: 'all',
      priceRange: [0, MAX_PRICE],
      surfaceRange: [0, MAX_SURFACE],
      bedrooms: '',
      governorate: 'all'
    };
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSearchTerm('');
    setSortOrder('date');
  };

  const applyFilters = () => {
    setAppliedFilters(tempFilters);
    onToggle();
  };

  const displayedHousings = useMemo(() => {
    return housings
      .filter(housing => {
        const matchesSearch = !searchTerm || 
          housing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          housing.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = appliedFilters.type === 'all' || 
          housing.type === appliedFilters.type;
        
        const matchesGovernorate = appliedFilters.governorate === 'all' || 
          housing.location === appliedFilters.governorate;
        
        const matchesBedrooms = !appliedFilters.bedrooms || 
          Number(housing.bedrooms) === Number(appliedFilters.bedrooms);
        
        const matchesPrice = 
          Number(housing.price) >= appliedFilters.priceRange[0] &&
          Number(housing.price) <= appliedFilters.priceRange[1];
        
        const matchesSurface = 
          Number(housing.surface) >= appliedFilters.surfaceRange[0] &&
          Number(housing.surface) <= appliedFilters.surfaceRange[1];
  
        return matchesSearch && 
               matchesType && 
               matchesGovernorate && 
               matchesBedrooms && 
               matchesPrice && 
               matchesSurface;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'price-asc':
            return Number(a.price) - Number(b.price);
          case 'price-desc':
            return Number(b.price) - Number(a.price);
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
  }, [housings, searchTerm, appliedFilters, sortOrder]);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('brand.200', 'brand.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  // Le reste du JSX reste identique
  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6} color={textColor}>Annonces de colocation</Heading>
      
      <VStack spacing={4} align="stretch">
        <HStack mb={2} spacing={4}>
          <Input
            placeholder="Rechercher une annonce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'brand.400' }}
          />
          <Select
            w="200px"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            bg={inputBg}
            borderColor={borderColor}
            _hover={{ borderColor: 'brand.400' }}
          >
            <option value="date">Plus récentes</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </Select>
          <Button 
            rightIcon={isOpen ? <FaChevronUp /> : <FaChevronDown />} 
            onClick={onToggle}
            colorScheme="brand"
          >
            Filtres
          </Button>
        </HStack>

        <Collapse in={isOpen}>
          <Box p={4} borderWidth="1px" borderRadius="lg" bg={bgColor} borderColor={borderColor}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <Box flex="1">
                  <Text mb={2}>Type de logement</Text>
                  <Select 
                    value={tempFilters.type} 
                    onChange={(e) => setTempFilters({...tempFilters, type: e.target.value})}
                  >
                    <option value="all">Tous</option>
                    <option value="house">Maison</option>
                    <option value="room">Chambre</option>
                  </Select>
                </Box>
                <Box flex="1">
                  <Text mb={2}>Gouvernorat</Text>
                  <Select 
                    value={tempFilters.governorate} 
                    onChange={(e) => setTempFilters({...tempFilters, governorate: e.target.value})}
                  >
                    <option value="all">Tous les gouvernorats</option>
                    {governorates.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </Select>
                </Box>
                <Box flex="1">
                  <Text mb={2}>Nombre de chambres</Text>
                  <NumberInput 
                    min={1} 
                    max={10} 
                    value={tempFilters.bedrooms}
                    onChange={(value) => setTempFilters({...tempFilters, bedrooms: value})}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Box>
              </HStack>

              <Box>
                <Text mb={2}>Prix (€/mois)</Text>
                <RangeSlider
                  min={0}
                  max={MAX_PRICE}
                  step={1000}
                  value={tempFilters.priceRange}
                  onChange={(value) => setTempFilters({...tempFilters, priceRange: value})}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <HStack justify="space-between" mt={2}>
                  <Text>{tempFilters.priceRange[0]}€</Text>
                  <Text>{tempFilters.priceRange[1]}€</Text>
                </HStack>
              </Box>

              <Box>
                <Text mb={2}>Surface (m²)</Text>
                <RangeSlider
                  min={0}
                  max={MAX_SURFACE}
                  step={10}
                  value={tempFilters.surfaceRange}
                  onChange={(value) => setTempFilters({...tempFilters, surfaceRange: value})}
                >
                  <RangeSliderTrack>
                    <RangeSliderFilledTrack />
                  </RangeSliderTrack>
                  <RangeSliderThumb index={0} />
                  <RangeSliderThumb index={1} />
                </RangeSlider>
                <HStack justify="space-between" mt={2}>
                  <Text>{tempFilters.surfaceRange[0]}m²</Text>
                  <Text>{tempFilters.surfaceRange[1]}m²</Text>
                </HStack>
              </Box>

              <HStack justify="flex-end" spacing={4} pt={4}>
                <Button 
                  onClick={resetFilters} 
                  variant="outline"
                  borderColor={borderColor}
                  color={textColor}
                >
                  Réinitialiser
                </Button>
                <Button 
                  onClick={applyFilters} 
                  colorScheme="brand"
                >
                  Appliquer les filtres
                </Button>
              </HStack>
            </VStack>
          </Box>
        </Collapse>

        {loading ? (
          <Box p={4} textAlign="center">Chargement des annonces...</Box>
        ) : displayedHousings.length === 0 ? (
          <Box p={4} textAlign="center">Aucune annonce disponible</Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {displayedHousings.map((housing) => (
              <HousingCard 
                key={housing._id}
                housing={housing}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default HousingList;