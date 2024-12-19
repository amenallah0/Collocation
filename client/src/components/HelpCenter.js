import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
  Badge,
  HStack
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaBook, 
  FaHeadset, 
  FaLightbulb, 
  FaVideo,
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaShieldAlt,
  FaCheckCircle,
  FaEnvelope
} from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Composant pour les articles populaires
const PopularArticle = ({ title, views, category }) => (
  <ListItem 
    p={3}
    _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
    borderRadius="md"
    cursor="pointer"
  >
    <Stack direction="row" justify="space-between" align="center">
      <HStack>
        <ListIcon as={FaCheckCircle} color="green.500" />
        <Text fontWeight="medium">{title}</Text>
      </HStack>
      <HStack spacing={4}>
        <Badge colorScheme="brand">{category}</Badge>
        <Text fontSize="sm" color="gray.500">{views} vues</Text>
      </HStack>
    </Stack>
  </ListItem>
);

// Composant pour les catégories d'aide
const HelpCategory = ({ icon, title, description, articles, onArticleClick }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  return (
    <VStack
      p={6}
      bg={bgColor}
      borderRadius="xl"
      boxShadow="xl"
      spacing={4}
      align="start"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
    >
      <Icon as={icon} w={8} h={8} color="brand.500" />
      <Heading size="md">{title}</Heading>
      <Text color={useColorModeValue('gray.600', 'gray.300')}>
        {description}
      </Text>
      <VStack align="start" w="full" spacing={2}>
        {articles.map((article, index) => (
          <Button
            key={index}
            variant="ghost"
            w="full"
            justifyContent="flex-start"
            leftIcon={<FaBook />}
            onClick={() => onArticleClick(article)}
            _hover={{ bg: hoverBg }}
          >
            {article.title}
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};

const HelpCenter = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: FaHome,
      title: 'Gestion de Colocation',
      description: 'Tout sur la gestion quotidienne de votre colocation',
      articles: [
        {
          title: 'Créer une annonce de colocation',
          content: 'Guide détaillé pour créer une annonce attractive...',
          category: 'Basique'
        },
        {
          title: 'Gérer les charges communes',
          content: 'Comment répartir et gérer les charges...',
          category: 'Finance'
        },
        {
          title: 'Règles de vie commune',
          content: 'Établir des règles de vie efficaces...',
          category: 'Organisation'
        }
      ]
    },
    {
      icon: FaUsers,
      title: 'Relations entre Colocataires',
      description: 'Conseils pour une colocation harmonieuse',
      articles: [
        {
          title: 'Organiser les tâches ménagères',
          content: 'Système de rotation des tâches...',
          category: 'Organisation'
        },
        {
          title: 'Gérer les conflits',
          content: 'Méthodes de résolution des conflits...',
          category: 'Communication'
        },
        {
          title: 'Accueillir un nouveau colocataire',
          content: 'Processus d\'intégration...',
          category: 'Social'
        }
      ]
    },
    {
      icon: FaMoneyBillWave,
      title: 'Aspects Financiers',
      description: 'Gestion financière de votre colocation',
      articles: [
        {
          title: 'Calculer le budget mensuel',
          content: 'Méthode de calcul du budget...',
          category: 'Finance'
        },
        {
          title: 'Caution et assurance',
          content: 'Informations sur les garanties...',
          category: 'Légal'
        },
        {
          title: 'Applications de partage de dépenses',
          content: 'Outils recommandés...',
          category: 'Tech'
        }
      ]
    }
  ];

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    onOpen();
  };

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.800')} minH="100vh">
      <Container maxW="container.xl" py={12}>
        <Stack spacing={12}>
          {/* Hero Section améliorée */}
          <Stack spacing={6} textAlign="center">
            <Heading 
              size="2xl"
              bgGradient="linear(to-r, brand.500, brand.300)"
              bgClip="text"
            >
              Centre d'aide Colocation
            </Heading>
            <Text 
              fontSize="xl" 
              color={useColorModeValue('gray.600', 'gray.300')}
              maxW="2xl"
              mx="auto"
            >
              Trouvez toutes les réponses à vos questions sur la colocation
              et la gestion de la vie en communauté
            </Text>
            
          </Stack>

          {/* Catégories d'aide */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {categories.map((category, index) => (
              <HelpCategory 
                key={index} 
                {...category}
                onArticleClick={handleArticleClick}
              />
            ))}
          </SimpleGrid>

          {/* Modal pour afficher l'article complet */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedArticle?.title}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                {selectedArticle?.content}
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* Contact Support amélioré */}
          <VStack 
            spacing={6} 
            p={8} 
            bg={useColorModeValue('white', 'gray.700')}
            borderRadius="xl"
            boxShadow="xl"
            textAlign="center"
          >
            <Heading size="lg">Besoin d'aide supplémentaire ?</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')}>
              Notre équipe de support est disponible 7j/7 pour vous aider
              avec vos questions sur la colocation
            </Text>
            <HStack spacing={4}>
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                colorScheme="brand"
                size="lg"
                leftIcon={<FaEnvelope />}
              >
                Envoyer un email
              </Button>
            </HStack>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default HelpCenter;