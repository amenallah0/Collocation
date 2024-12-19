import {
    Box,
    Container,
    Stack,
    Heading,
    Text,
    SimpleGrid,
    Image,
    Icon,
    VStack,
    HStack,
    useColorModeValue,
    Divider,
    Button
  } from '@chakra-ui/react';
  import { FaUsers, FaHandshake, FaHome, FaChartLine } from 'react-icons/fa';
  import { Link as RouterLink } from 'react-router-dom';
  import colocationBanner from '../assets/colocation.jpeg';
  
  // Composant pour les statistiques
  const StatCard = ({ icon, number, label }) => (
    <VStack
      p={6}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="md"
      spacing={3}
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Icon as={icon} w={8} h={8} color="brand.500" />
      <Text fontSize="3xl" fontWeight="bold">{number}</Text>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>{label}</Text>
    </VStack>
  );
  
  // Composant pour les valeurs
  const ValueCard = ({ title, description }) => (
    <VStack
      align="start"
      p={6}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="md"
      spacing={4}
    >
      <Heading size="md" color="brand.500">
        {title}
      </Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {description}
      </Text>
    </VStack>
  );
  
  const AboutUs = () => {
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const stats = [
      { icon: FaUsers, number: '10K+', label: 'Utilisateurs actifs' },
      { icon: FaHome, number: '5K+', label: 'Colocations' },
      { icon: FaHandshake, number: '15K+', label: 'Mises en relation' },
      { icon: FaChartLine, number: '95%', label: 'Taux de satisfaction' }
    ];
  
    const values = [
      {
        title: 'Confiance',
        description: 'Nous créons un environnement sûr et transparent pour tous nos utilisateurs.'
      },
      {
        title: 'Innovation',
        description: 'Nous utilisons les dernières technologies pour simplifier votre recherche.'
      },
      {
        title: 'Communauté',
        description: 'Nous favorisons des connexions authentiques entre colocataires.'
      }
    ];
  
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="container.xl" py={12}>
          <Stack spacing={12}>
            {/* Hero Section */}
            <Stack 
              direction={{ base: 'column', lg: 'row' }} 
              spacing={8} 
              align="center"
            >
              <Stack flex={1} spacing={5}>
                <Heading 
                  size="2xl"
                  bgGradient="linear(to-r, brand.500, brand.300)"
                  bgClip="text"
                >
                  Notre Mission
                </Heading>
                <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
                  Faciliter la recherche de colocation en Tunisie en créant une plateforme 
                  innovante et sécurisée qui met en relation les personnes partageant 
                  les mêmes valeurs.
                </Text>
                <Button
                  as={RouterLink}
                  to="/contact"
                  size="lg"
                  colorScheme="brand"
                  width="fit-content"
                >
                  Contactez-nous
                </Button>
              </Stack>
              <Box 
                flex={1}
                boxShadow="2xl"
                borderRadius="2xl"
                overflow="hidden"
              >
                <Image 
                  src={colocationBanner} 
                  alt="Notre équipe"
                  objectFit="cover"
                  w="full"
                  h="400px"
                />
              </Box>
            </Stack>
  
            {/* Stats Section */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </SimpleGrid>
  
            <Divider />
  
            {/* Nos Valeurs */}
            <Stack spacing={8}>
              <Heading 
                textAlign="center"
                size="xl"
                bgGradient="linear(to-r, brand.500, brand.300)"
                bgClip="text"
              >
                Nos Valeurs
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {values.map((value, index) => (
                  <ValueCard key={index} {...value} />
                ))}
              </SimpleGrid>
            </Stack>
          </Stack>
        </Container>
      </Box>
    );
  };
  
  export default AboutUs;