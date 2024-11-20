import {
    Box,
    Image,
    Badge,
    Text,
    VStack,
    HStack,
    IconButton,
    useColorModeValue
  } from '@chakra-ui/react';
  import { FaHeart, FaShare } from 'react-icons/fa';
  import { Link as RouterLink } from 'react-router-dom';
  
  const HousingCard = ({ housing }) => {
    const {
      id,
      title,
      price,
      images,
      type,
      location,
      isActive,
      bedrooms,
      surface
    } = housing;
  
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
  
    return (
        <Box
          as={RouterLink}
          to={`/housing/${housing.id}`}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          _hover={{ transform: 'scale(1.02)' }}
          transition="transform 0.2s"
        >
        <Box position="relative">
          <Image
            src={images[0]}
            alt={title}
            height="200px"
            width="100%"
            objectFit="cover"
          />
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme={isActive ? 'green' : 'red'}
          >
            {isActive ? 'Disponible' : 'Indisponible'}
          </Badge>
        </Box>
  
        <Box p={4}>
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xl" fontWeight="semibold" noOfLines={1}>
              {title}
            </Text>
            
            <Text color="blue.600" fontSize="2xl" fontWeight="bold">
              {price}€/mois
            </Text>
  
            <HStack spacing={4}>
              <Badge>{type}</Badge>
              <Text fontSize="sm">{surface}m²</Text>
              <Text fontSize="sm">{bedrooms} ch.</Text>
            </HStack>
  
            <Text fontSize="sm" color="gray.500">
              {location}
            </Text>
  
            <HStack justify="space-between">
              <IconButton
                icon={<FaHeart />}
                variant="ghost"
                aria-label="Favoris"
                onClick={(e) => {
                  e.preventDefault();
                  // Logique pour ajouter aux favoris
                }}
              />
              <IconButton
                icon={<FaShare />}
                variant="ghost"
                aria-label="Partager"
                onClick={(e) => {
                  e.preventDefault();
                  // Logique pour partager
                }}
              />
            </HStack>
          </VStack>
        </Box>
      </Box>
    );
  };
  
  export default HousingCard;