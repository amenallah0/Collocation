import {
    Box,
    Image,
    Badge,
    Text,
    AspectRatio,
    useColorModeValue,
    IconButton,
    useToast
  } from '@chakra-ui/react';
  import { useNavigate } from 'react-router-dom';
  import { FaHeart } from 'react-icons/fa';
  import { useAuth } from '../../context/AuthContext';
  import { housingAPI } from '../../services/api';
  
  const HousingCard = ({ housing, onFavoriteToggle, isFavorite }) => {
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
          status: 'success',
          duration: 3000,
          isClosable: true,
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

    return (
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden"
        bg={useColorModeValue('white', 'gray.800')}
        cursor="pointer"
        onClick={handleClick}
        _hover={{ 
          transform: 'translateY(-5px)', 
          transition: 'transform 0.2s',
          shadow: 'lg'
        }}
      >
        
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
        
        <Box p="6">
          <Box d="flex" alignItems="baseline">
            <Badge borderRadius="full" px="2" colorScheme="teal">
              {housing.type === 'house' ? 'Maison' : 'Chambre'}
            </Badge>
            <Box
              color="gray.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="xs"
              textTransform="uppercase"
              ml="2"
            >
              {housing.surface} m² • {housing.bedrooms} ch
            </Box>
          </Box>
          {user && (
          
          <IconButton
            icon={<FaHeart />}
            position="relative"
            top={-10}
            right={-80}
            zIndex={2}
            colorScheme={"blue"}
            variant="solid"
            onClick={handleFavoriteClick}
            aria-label="Ajouter aux favoris"
          />
        )}
          <Box
            mt="-7"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            noOfLines={1}
          >
            {housing.title}
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {housing.price} TND
              <Box as="span" color="gray.600" fontSize="sm" fontWeight="normal">
                / mois
              </Box>
            </Text>
          </Box>

          <Box mt="2" color="gray.600" fontSize="sm">
            {housing.location}
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default HousingCard;