import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  VStack,
  HStack
} from '@chakra-ui/react';
import { FaSearch, FaHeadset, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const categories = [
    {
      name: 'Recherche de Colocation',
      questions: [
        {
          q: "Comment trouver la colocation idéale ?",
          a: "Pour trouver la colocation parfaite, définissez vos critères (budget, localisation, ambiance), utilisez les filtres de recherche, lisez attentivement les descriptions et n'hésitez pas à poser des questions aux colocataires actuels. Visitez le logement si possible et rencontrez vos futurs colocataires."
        },
        {
          q: "Quels sont les critères importants à vérifier ?",
          a: "Vérifiez le montant du loyer et des charges, la durée du bail, les conditions de la caution, l'état du logement, les règles de vie commune, la répartition des tâches et l'ambiance générale de la colocation."
        },
        {
          q: "Comment contacter les colocataires ?",
          a: "Utilisez notre système de messagerie intégré pour contacter les colocataires. Présentez-vous brièvement et posez des questions pertinentes sur la colocation et la vie quotidienne."
        }
      ]
    },
    {
      name: 'Gestion de Colocation',
      questions: [
        {
          q: "Comment gérer les dépenses communes ?",
          a: "Nous recommandons de créer un pot commun pour les dépenses partagées, d'utiliser une application de partage des dépenses, et d'établir des règles claires dès le début. Gardez toutes les factures et faites un bilan mensuel."
        },
        {
          q: "Comment établir des règles de vie commune ?",
          a: "Organisez une réunion avec tous les colocataires pour définir ensemble les règles concernant le ménage, les invités, le bruit, les courses communes, etc. Mettez ces règles par écrit et affichez-les dans un espace commun."
        },
        {
          q: "Que faire en cas de conflit ?",
          a: "Privilégiez le dialogue, organisez une réunion pour discuter calmement des problèmes. Si nécessaire, utilisez notre service de médiation gratuit pour les colocations."
        }
      ]
    },
    {
      name: 'Aspects Juridiques',
      questions: [
        {
          q: "Quel type de contrat pour une colocation ?",
          a: "Vous pouvez opter pour un bail unique avec tous les colocataires ou des baux individuels. Chaque option a ses avantages. Un bail unique favorise la solidarité mais implique une responsabilité partagée."
        },
        {
          q: "Comment fonctionne la caution en colocation ?",
          a: "La caution correspond généralement à un mois de loyer. En cas de bail unique, chaque colocataire peut fournir un garant pour sa part. Pour les baux individuels, chacun verse sa propre caution."
        },
        {
          q: "Quelles assurances sont nécessaires ?",
          a: "Une assurance habitation est obligatoire. Chaque colocataire doit être assuré, soit par une assurance commune, soit individuellement. Vérifiez que l'assurance couvre les dommages causés par les colocataires."
        }
      ]
    }
  ];

  // Filtrer les questions en fonction de la recherche
  const filterQuestions = (category) => {
    if (!searchQuery) return category.questions;
    return category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

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
              Foire Aux Questions
            </Heading>
            <Text fontSize="xl" color={textColor}>
              Tout ce que vous devez savoir sur la colocation
            </Text>
          </Stack>

          {/* FAQ Tabs */}
          <Tabs colorScheme="brand" isLazy>
            <TabList>
              {categories.map((category, index) => (
                <Tab key={index}>{category.name}</Tab>
              ))}
            </TabList>

            <TabPanels>
              {categories.map((category, index) => (
                <TabPanel key={index}>
                  <Accordion allowMultiple>
                    {filterQuestions(category).map((item, qIndex) => (
                      <AccordionItem key={qIndex}>
                        <AccordionButton 
                          _hover={{ bg: hoverBgColor }}
                          py={4}
                        >
                          <Box flex="1" textAlign="left">
                            <Text fontWeight="medium">{item.q}</Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel 
                          pb={6}
                          color={textColor}
                          fontSize="md"
                          lineHeight="tall"
                        >
                          {item.a}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          {/* Section Support */}
          <VStack 
            spacing={6} 
            p={8} 
            bg={useColorModeValue('white', 'gray.700')}
            borderRadius="xl"
            boxShadow="xl"
            textAlign="center"
          >
            <Heading size="lg">Vous n'avez pas trouvé votre réponse ?</Heading>
            <Text color={textColor}>
              Notre équipe est là pour répondre à toutes vos questions
            </Text>
            <HStack spacing={4}>
              <Button
                colorScheme="brand"
                size="lg"
                leftIcon={<FaHeadset />}
              >
                Chat en direct
              </Button>
              <Button
                variant="outline"
                colorScheme="brand"
                size="lg"
                leftIcon={<FaEnvelope />}
              >
                Nous contacter
              </Button>
            </HStack>
          </VStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default FAQ;