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
  Skeleton,
  Icon,
  Tooltip,
  Divider,
  Grid,
  useBreakpointValue,
  InputGroup,
  InputLeftElement,
  useColorModeValue
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp, FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import HousingCard from './HousingCard';
import { mockHousings } from '../../data/mockHousings';
import { housingAPI } from '../../services/api';
import { useToast } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../layout/Footer';

const HousingList = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('date');
  const [housings, setHousings] = useState([]);
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(searchParams.get('page')) || 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalHousings, setTotalHousings] = useState(0);

  // Définir des constantes pour les valeurs max
  const MAX_PRICE = 10000;
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

  const sortHousings = (housingsToSort) => {
    return [...housingsToSort].sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return Number(a.price) - Number(b.price);
        case 'price-desc':
          return Number(b.price) - Number(a.price);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  useEffect(() => {
    const fetchHousings = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: '9',
          sort: sortOrder,
          ...(searchTerm && { search: searchTerm }),
          ...(appliedFilters.type !== 'all' && { type: appliedFilters.type }),
          ...(appliedFilters.governorate !== 'all' && { location: appliedFilters.governorate }),
          ...(appliedFilters.bedrooms && { bedrooms: appliedFilters.bedrooms }),
          ...(appliedFilters.priceRange[0] > 0 && { minPrice: appliedFilters.priceRange[0] }),
          ...(appliedFilters.priceRange[1] < MAX_PRICE && { maxPrice: appliedFilters.priceRange[1] }),
          ...(appliedFilters.surfaceRange[0] > 0 && { minSurface: appliedFilters.surfaceRange[0] }),
          ...(appliedFilters.surfaceRange[1] < MAX_SURFACE && { maxSurface: appliedFilters.surfaceRange[1] })
        });

        const response = await housingAPI.getAll(queryParams);
        setHousings(response.housings);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setTotalHousings(response.totalHousings);
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
  }, [currentPage, appliedFilters, sortOrder, searchTerm]);

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

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('brand.200', 'brand.700');
  const inputBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Ajout des styles adaptatifs
  const filterBg = useColorModeValue('gray.50', 'gray.700');
  const shadowColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={4} alignItems="center">
          <Heading 
            size="xl" 
            color={textColor}
            fontWeight="bold"
            bgGradient="linear(to-r, brand.500, brand.300)"
            bgClip="text"
          >
            Trouvez votre colocation idéale
          </Heading>
          <Text color="gray.500" textAlign={{ base: 'left', md: 'right' }}>
            {totalHousings} annonces disponibles
          </Text>
        </Grid>

        <Box 
          p={6} 
          bg={bgColor} 
          borderRadius="xl" 
          boxShadow={`0 4px 12px ${shadowColor}`}
        >
          <VStack spacing={4}>
            <HStack w="full" spacing={4}>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Rechercher une annonce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={inputBg}
                  _hover={{ borderColor: 'brand.400' }}
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px brand.500' }}
                />
              </InputGroup>

              <Tooltip label="Trier les annonces">
                <Select
                  w={{ base: '120px', md: '200px' }}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  bg={inputBg}
                  icon={<FaSortAmountDown />}
                >
                  <option value="date">Plus récentes</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </Select>
              </Tooltip>

              <Button 
                leftIcon={<FaFilter />}
                onClick={onToggle}
                colorScheme="brand"
                variant={isOpen ? "solid" : "outline"}
              >
                {isMobile ? '' : 'Filtres'}
              </Button>
            </HStack>

            <Collapse in={isOpen} animateOpacity>
              <Box 
                p={6} 
                bg={filterBg} 
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
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
                    <Text mb={2}>Prix (TND/mois)</Text>
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
                      <Text>{tempFilters.priceRange[0]} TND</Text>
                      <Text>{tempFilters.priceRange[1]} TND</Text>
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
          </VStack>
        </Box>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height="400px" borderRadius="lg" />
            ))}
          </SimpleGrid>
        ) : housings.length === 0 ? (
          <Box 
            p={8} 
            textAlign="center" 
            bg={bgColor} 
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Icon as={FaSearch} w={12} h={12} color="gray.400" mb={4} />
            <Text fontSize="xl" color={textColor}>
              Aucune annonce ne correspond à vos critères
            </Text>
            <Button 
              mt={4} 
              onClick={resetFilters}
              colorScheme="brand"
              variant="outline"
            >
              Réinitialiser les filtres
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {sortHousings(housings).map((housing) => (
              <HousingCard 
                key={housing._id}
                housing={housing}
                isFavorite={false}
              />
            ))}
          </SimpleGrid>
        )}

        <Divider />

        <HStack justify="center" spacing={4}>
          <Button
            onClick={handlePreviousPage}
            isDisabled={currentPage === 1}
            colorScheme="brand"
            variant="outline"
            leftIcon={<Icon as={FaChevronUp} transform="rotate(-90deg)" />}
          >
            Précédent
          </Button>
          
          <Text fontWeight="medium">
            Page {currentPage} sur {totalPages}
          </Text>
          
          <Button
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            colorScheme="brand"
            rightIcon={<Icon as={FaChevronUp} transform="rotate(90deg)" />}
          >
            Suivant
          </Button>
        </HStack>
      </VStack>
      <Footer />
    </Container>
  );
};

export default HousingList;