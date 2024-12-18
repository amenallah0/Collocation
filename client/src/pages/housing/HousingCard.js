import {
    Box,
    Image,
    Badge,
    Text,
    AspectRatio,
    useColorModeValue,
    IconButton,
    useToast,
    HStack,
    Flex,
    VStack
  } from '@chakra-ui/react';
  import { useNavigate } from 'react-router-dom';
  import { FaHeart } from 'react-icons/fa';
  import { useAuth } from '../../context/AuthContext';
  import { housingAPI } from '../../services/api';
  
  const HousingCard = ({ housing, onFavoriteToggle, isFavorite, showFavoriteButton = true }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const imageUrl = housing.images?.[0]
      ? `http://localhost:5000${housing.images[0]}`
      : 'https://via.placeholder.com/400x300?text=Pas+d%27image';

    const handleClick = () => {
      navigate(`/housings/${housing._id}`);
    };

    const handleFavoriteClick = async (e) => {
      e.stopPropagation(); // Empêcher la navigation
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const result = await housingAPI.toggleFavorite(housing._id);
        if (onFavoriteToggle) {
          onFavoriteToggle(housing._id);
        }

        toast({
          title: result.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris',
          description: result.isFavorite 
            ? 'L\'annonce a été ajoutée à vos favoris.' 
            : 'L\'annonce a été retirée de vos favoris.',
          status: result.isFavorite ? 'success' : 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          variant: 'solid',
          icon: result.isFavorite ? '❤️' : '💔',
        });
      } catch (error) {
        console.error('Error toggling favorite:', error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la mise à jour des favoris.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');
    const favoriteColor = useColorModeValue('red.500', 'red.300');
    const favoriteBg = useColorModeValue('white', 'gray.700');

    return (
      <Box 
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={bgColor}
        position="relative"
        transition="transform 0.2s"
        _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
        cursor="pointer"
        onClick={handleClick}
      >
        {showFavoriteButton && (
          <IconButton
            icon={<FaHeart />}
            isRound
            size="sm"
            position="absolute"
            top="4"
            right="4"
            zIndex="1"
            color={isFavorite ? favoriteColor : 'gray.400'}
            bg={favoriteBg}
            onClick={handleFavoriteClick}
            _hover={{
              transform: 'scale(1.1)',
              color: favoriteColor
            }}
            boxShadow="md"
            aria-label="Ajouter aux favoris"
          />
        )}

        <Box position="relative" height="200px">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={imageUrl}
              alt={housing.title}
              objectFit="cover"
              width="100%"
              height="100%"
              fallback={
                <Box 
                  height="100%" 
                  width="100%" 
                  bg="gray.100" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Text color="gray.500">Image non disponible</Text>
                </Box>
              }
            />
          </AspectRatio>
          
          <Badge
            position="absolute"
            top="4"
            left="4"
            colorScheme={housing.isActive ? "green" : "red"}
            px="2"
            borderRadius="full"
            boxShadow="md"
          >
            {housing.isActive ? "Disponible" : "Indisponible"}
          </Badge>
        </Box>
        
        <Box p="6">
          <VStack align="stretch" spacing={3}>
            <Text
              fontWeight="semibold"
              fontSize="xl"
              color={textColor}
              noOfLines={1}
            >
              {housing.title}
            </Text>

            <HStack justify="space-between" wrap="wrap">
              <Badge colorScheme="blue" px="2" borderRadius="full">
                {housing.type === 'house' ? 'Maison' : 'Appartement'}
              </Badge>
              <Text fontWeight="bold" color={textColor}>
                {housing.price} TND/mois
              </Text>
            </HStack>

            <HStack spacing={4} color="gray.600">
              <Text>{housing.surface}m²</Text>
              <Text>{housing.bedrooms} ch.</Text>
              <Text noOfLines={1}>{housing.location}</Text>
            </HStack>
          </VStack>
        </Box>
      </Box>
    );
  };
  
  export default HousingCard;