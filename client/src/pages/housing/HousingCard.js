import {
    Box,
    Image,
    Badge,
    Text,
    AspectRatio,
    useColorModeValue
  } from '@chakra-ui/react';
  import { useNavigate } from 'react-router-dom';
  
  const HousingCard = ({ housing }) => {
    const navigate = useNavigate();
    const imageUrl = housing.images?.[0]
      ? `http://localhost:5000${housing.images[0]}`
      : 'https://via.placeholder.com/400x300?text=Pas+d%27image';

    const handleClick = () => {
      navigate(`/housings/${housing._id}`);
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

          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            noOfLines={1}
          >
            {housing.title}
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {housing.price}€
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