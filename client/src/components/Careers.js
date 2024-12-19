import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Flex,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  InputGroup,
  InputLeftElement,
  useDisclosure
} from '@chakra-ui/react';
import { 
  FaBriefcase, 
  FaGraduationCap, 
  FaRocket, 
  FaHeart, 
  FaHome, 
  FaUsers, 
  FaHandshake, 
  FaLightbulb,
  FaCoffee,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaFile
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { useState, useRef } from 'react';

const MotionBox = motion(Box);

// Composant pour les avantages avec animation
const BenefitCard = ({ icon, title, description, delay }) => (
  <MotionBox
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <VStack
      p={8}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="xl"
      boxShadow="xl"
      spacing={4}
      h="full"
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-5px)',
        boxShadow: '2xl',
        borderColor: 'brand.500',
        borderWidth: '2px'
      }}
    >
      <Icon as={icon} w={10} h={10} color="brand.500" />
      <Text fontWeight="bold" fontSize="xl">{title}</Text>
      <Text 
        color={useColorModeValue('gray.600', 'gray.300')} 
        textAlign="center"
        fontSize="md"
      >
        {description}
      </Text>
    </VStack>
  </MotionBox>
);

// Composant pour le formulaire de candidature
const ApplicationForm = ({ isOpen, onClose, jobTitle }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      let fileUrl = '';

      // Si un fichier est sélectionné, on l'upload d'abord
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        
        try {
          // Utilisation de file.io au lieu de tmpfiles.org
          const response = await fetch('https://file.io', {
            method: 'POST',
            body: uploadData
          });
          
          const result = await response.json();
          if (result.success) {
            fileUrl = result.link; // file.io renvoie directement un lien de téléchargement
          }
        } catch (uploadError) {
          console.error('Erreur upload:', uploadError);
          throw new Error('Erreur lors de l\'upload du CV');
        }
      }

      // Préparation des données pour EmailJS
      const data = {
        to_email: "admin@collocation.com",
        from_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        phone: formData.get('phone'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        job_title: jobTitle,
        message: formData.get('message'),
        cv_url: fileUrl || 'Aucun CV joint',
        cv_name: selectedFile ? selectedFile.name : 'Aucun fichier sélectionné'
      };

      // Envoi de l'email
      await emailjs.send(
        'service_xze6buo',
        'template_ufyg20j',
        data,
        'sJibSsHqd8Ovlku3z'
      );

      toast({
        title: "Candidature envoyée",
        description: "Nous vous contacterons bientôt !",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérification de la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "Le fichier ne doit pas dépasser 10MB",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Postuler pour : {jobTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Prénom</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaUser} color="gray.500" />
                    </InputLeftElement>
                    <Input name="firstName" placeholder="Votre prénom" />
                  </InputGroup>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Nom</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaUser} color="gray.500" />
                    </InputLeftElement>
                    <Input name="lastName" placeholder="Votre nom" />
                  </InputGroup>
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaEnvelope} color="gray.500" />
                  </InputLeftElement>
                  <Input name="email" type="email" placeholder="votre@email.com" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Téléphone</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FaPhone} color="gray.500" />
                  </InputLeftElement>
                  <Input name="phone" type="tel" placeholder="+216 XX XXX XXX" />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sujet</FormLabel>
                <Input name="subject" placeholder="Objet de votre candidature" />
              </FormControl>

              <FormControl>
                <FormLabel>Message (optionnel)</FormLabel>
                <Input name="message" placeholder="Votre message" />
              </FormControl>

              <FormControl>
                <FormLabel>CV</FormLabel>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  display="none"
                  ref={fileInputRef}
                />
                <Button
                  onClick={() => fileInputRef.current.click()}
                  leftIcon={<FaFile />}
                  w="full"
                >
                  {selectedFile ? selectedFile.name : "Importer votre CV"}
                </Button>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              isLoading={isLoading}
              loadingText="Envoi en cours..."
            >
              Envoyer ma candidature
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// Composant pour les offres d'emploi amélioré
const JobCard = ({ title, department, location, type, requirements, description }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        p={6}
        bg={useColorModeValue('white', 'gray.700')}
        borderRadius="xl"
        boxShadow="xl"
        transition="all 0.3s"
        _hover={{ 
          transform: 'translateY(-5px)',
          boxShadow: '2xl',
          borderColor: 'brand.500',
          borderWidth: '2px'
        }}
      >
        <Stack spacing={4}>
          <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
            {title}
          </Heading>
          <HStack flexWrap="wrap" spacing={2}>
            <Badge colorScheme="brand">{department}</Badge>
            <Badge colorScheme="gray">{location}</Badge>
            <Badge colorScheme="green">{type}</Badge>
          </HStack>
          <Text color={useColorModeValue('gray.600', 'gray.300')}>
            {description}
          </Text>
          <Divider />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Compétences requises :</Text>
            {requirements.map((req, index) => (
              <HStack key={index}>
                <Icon as={FaLightbulb} color="brand.500" />
                <Text>{req}</Text>
              </HStack>
            ))}
          </VStack>
          <Button 
            colorScheme="brand" 
            size="md"
            w="full"
            leftIcon={<FaBriefcase />}
            onClick={onOpen}
          >
            Postuler
          </Button>
        </Stack>
      </Box>
      <ApplicationForm isOpen={isOpen} onClose={onClose} jobTitle={title} />
    </>
  );
};

const Careers = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const benefits = [
    {
      icon: FaUsers,
      title: 'Impact Social',
      description: 'Contribuez à transformer le marché de la colocation en Tunisie et facilitez l\'accès au logement pour tous'
    },
    {
      icon: FaHandshake,
      title: 'Collaboration',
      description: 'Travaillez dans une équipe dynamique et multiculturelle passionnée par l\'innovation sociale'
    },
    {
      icon: FaRocket,
      title: 'Innovation',
      description: 'Participez au développement de solutions technologiques innovantes pour le secteur de l\'habitat partagé'
    },
    {
      icon: FaGraduationCap,
      title: 'Formation Continue',
      description: 'Bénéficiez de formations régulières et développez vos compétences dans le secteur de l\'immobilier'
    },
    {
      icon: FaCoffee,
      title: 'Environnement Flexible',
      description: 'Profitez d\'un cadre de travail moderne et flexible, avec possibilité de télétravail'
    },
    {
      icon: FaHeart,
      title: 'Avantages Sociaux',
      description: 'Accédez à une mutuelle santé, des tickets restaurant et des réductions sur les colocations'
    }
  ];

  const jobs = [
    {
      title: 'Community Manager',
      department: 'Marketing',
      location: 'Tunis',
      type: 'CDI',
      description: 'Gérez et animez notre communauté de colocataires, créez du contenu engageant et développez notre présence sur les réseaux sociaux.',
      requirements: [
        'Expérience en community management',
        'Excellentes capacités rédactionnelles',
        'Maîtrise des réseaux sociaux',
        'Créativité et autonomie'
      ]
    },
    {
      title: 'Développeur Full Stack',
      department: 'Tech',
      location: 'Remote',
      type: 'CDI',
      description: 'Participez au développement de notre plateforme de colocation en utilisant les dernières technologies web.',
      requirements: [
        'Maîtrise de React et Node.js',
        'Expérience en développement d\'API',
        'Connaissance des bases de données',
        'Sensibilité UX/UI'
      ]
    },
    {
      title: 'Agent Immobilier',
      department: 'Commercial',
      location: 'Sfax',
      type: 'CDI',
      description: 'Développez notre portefeuille de biens en colocation et accompagnez les propriétaires et colocataires.',
      requirements: [
        'Expérience en immobilier',
        'Excellent relationnel',
        'Permis B',
        'Sens commercial'
      ]
    }
  ];

  const faqItems = [
    {
      question: 'Quelles sont les valeurs de l\'entreprise ?',
      answer: 'Notre mission est de faciliter l\'accès au logement partagé en Tunisie. Nos valeurs principales sont la confiance, l\'innovation et la communauté.'
    },
    {
      question: 'Comment se déroule l\'intégration ?',
      answer: 'Vous serez accompagné par un mentor et aurez accès à toutes les ressources nécessaires pour comprendre le marché de la colocation et notre vision.'
    },
    {
      question: 'Quels sont les avantages ?',
      answer: 'Nous offrons un environnement de travail flexible, des formations continues sur le secteur immobilier et la possibilité de participer à la transformation du marché de la colocation.'
    }
  ];

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.800')} minH="100vh">
      <Container maxW="container.xl" py={12}>
        <Stack spacing={16}>
          {/* Hero Section améliorée */}
          <Stack spacing={6} textAlign="center">
            <Heading 
              size="2xl"
              bgGradient="linear(to-r, brand.500, brand.300)"
              bgClip="text"
            >
              Rejoignez l'Aventure Collocation
            </Heading>
            <Text 
              fontSize="xl" 
              color={useColorModeValue('gray.600', 'gray.300')}
              maxW="3xl"
              mx="auto"
            >
              Participez à la transformation du marché de la colocation en Tunisie 
              et contribuez à rendre le logement plus accessible et convivial
            </Text>
          </Stack>

          {/* Benefits Section */}
          <Stack spacing={8}>
            <Heading 
              textAlign="center"
              size="xl"
              bgGradient="linear(to-r, brand.500, brand.300)"
              bgClip="text"
            >
              Pourquoi nous rejoindre ?
            </Heading>
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={8}
              pt={4}
            >
              {benefits.map((benefit, index) => (
                <BenefitCard 
                  key={index} 
                  {...benefit} 
                  delay={index * 0.1}
                />
              ))}
            </SimpleGrid>
          </Stack>

          {/* Open Positions */}
          <Stack spacing={8}>
            <Heading 
              textAlign="center"
              size="xl"
              bgGradient="linear(to-r, brand.500, brand.300)"
              bgClip="text"
            >
              Postes Disponibles
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {jobs.map((job, index) => (
                <JobCard key={index} {...job} />
              ))}
            </SimpleGrid>
          </Stack>

          {/* FAQ Section */}
          <Stack spacing={8}>
            <Heading 
              textAlign="center"
              size="xl"
              bgGradient="linear(to-r, brand.500, brand.300)"
              bgClip="text"
            >
              Questions Fréquentes
            </Heading>
            <Accordion allowMultiple>
              {faqItems.map((item, index) => (
                <AccordionItem key={index}>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="medium">{item.question}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {item.answer}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Stack>

          {/* CTA Section */}
          <VStack spacing={4} py={8}>
            <Heading size="lg">Envie de nous rejoindre ?</Heading>
            <Button
              size="lg"
              colorScheme="brand"
              leftIcon={<FaBriefcase />}
              onClick={onOpen}
            >
              Postuler maintenant
            </Button>
          </VStack>

          <ApplicationForm 
            isOpen={isOpen} 
            onClose={onClose} 
            jobTitle="Candidature spontanée" 
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default Careers;