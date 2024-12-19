import {
    Box,
    Container,
    Stack,
    Heading,
    Text,
    SimpleGrid,
    Image,
    VStack,
    HStack,
    Icon,
    useColorModeValue,
    Button
  } from '@chakra-ui/react';
  import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';
  import moiImage from '../assets/moi.jpg';
  
  const TeamMember = ({ name, role, image, bio, social }) => (
    <VStack
      p={6}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="md"
      spacing={4}
      align="center"
      transition="transform 0.3s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      <Box
        rounded="full"
        overflow="hidden"
        boxSize="200px"
        boxShadow="lg"
      >
        <Image
          src={image}
          alt={name}
          objectFit="cover"
          w="full"
          h="full"
        />
      </Box>
      <VStack spacing={2}>
        <Heading size="md">{name}</Heading>
        <Text 
          color="brand.500" 
          fontWeight="medium"
        >
          {role}
        </Text>
        <Text
          color={useColorModeValue('gray.600', 'gray.300')}
          textAlign="center"
          fontSize="sm"
        >
          {bio}
        </Text>
      </VStack>
      <HStack spacing={4}>
        {social.linkedin && (
          <Button
            as="a"
            href={social.linkedin}
            target="_blank"
            size="sm"
            colorScheme="linkedin"
            leftIcon={<FaLinkedin />}
          >
            LinkedIn
          </Button>
        )}
        {social.twitter && (
          <Button
            as="a"
            href={social.twitter}
            target="_blank"
            size="sm"
            colorScheme="twitter"
            leftIcon={<FaTwitter />}
          >
            Twitter
          </Button>
        )}
        {social.email && (
          <Button
            as="a"
            href={`mailto:${social.email}`}
            size="sm"
            colorScheme="brand"
            leftIcon={<FaEnvelope />}
          >
            Email
          </Button>
        )}
      </HStack>
    </VStack>
  );
  
  const Team = () => {
    const teamMembers = [
      {
        name: "Amen Allah Jouila",
        role: "CEO & Fondateur",
        image: moiImage,
        bio: "Passionné par l'innovation sociale et l'habitat partagé",
        social: {
          linkedin: "https://www.linkedin.com/in/amen-allah-jouila",
          twitter: "#",
          email: "amenallah@collocation.com"
        }
      },
      {
        name: "Mohamed Karim",
        role: "CTO",
        image: moiImage,
        bio: "Expert en développement web et technologies cloud",
        social: {
          linkedin: "#",
          twitter: "#",
          email: "mohamed@collocation.com"
        }
      },
      {
        name: "Leila Mansour",
        role: "Responsable Marketing",
        image: moiImage,
        bio: "Spécialiste en marketing digital et communication",
        social: {
          linkedin: "#",
          twitter: "#",
          email: "leila@collocation.com"
        }
      }
    ];
  
    return (
      <Box bg={useColorModeValue('gray.50', 'gray.800')} minH="100vh">
        <Container maxW="container.xl" py={12}>
          <Stack spacing={12}>
            {/* Hero Section */}
            <Stack spacing={6} textAlign="center">
              <Heading 
                size="2xl"
                bgGradient="linear(to-r, brand.500, brand.300)"
                bgClip="text"
              >
                Notre Équipe
              </Heading>
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
                Des passionnés qui travaillent pour vous offrir la meilleure expérience
              </Text>
            </Stack>
  
            {/* Team Members Grid */}
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={8}
              pt={8}
            >
              {teamMembers.map((member, index) => (
                <TeamMember key={index} {...member} />
              ))}
            </SimpleGrid>
  
            {/* Join Us Section */}
            <VStack spacing={6} pt={12}>
              <Heading size="lg">Rejoignez l'aventure !</Heading>
              <Text 
                color={useColorModeValue('gray.600', 'gray.300')}
                textAlign="center"
                maxW="2xl"
              >
                Nous sommes toujours à la recherche de talents passionnés pour rejoindre notre équipe.
                Découvrez nos opportunités de carrière.
              </Text>
              <Button
                as="a"
                href="/"
                size="lg"
                colorScheme="brand"
              >
                Voir nos offres de colocation
              </Button>
            </VStack>
          </Stack>
        </Container>
      </Box>
    );
  };
  
  export default Team;