import {
    Box,
    Container,
    Stack,
    Heading,
    Text,
    SimpleGrid,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    VStack,
    Icon,
    useColorModeValue,
    Select,
    useToast
  } from '@chakra-ui/react';
  import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
  import { useState } from 'react';
  import emailjs from '@emailjs/browser';
  
  const ContactInfo = ({ icon, title, content, link }) => (
    <VStack
      p={6}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="md"
      spacing={4}
      flex={1}
    >
      <Icon as={icon} w={6} h={6} color="brand.500" />
      <Text fontWeight="bold">{title}</Text>
      <Text 
        color={useColorModeValue('gray.600', 'gray.300')}
        as={link ? 'a' : 'p'}
        href={link}
        _hover={{ color: link ? 'brand.500' : undefined }}
      >
        {content}
      </Text>
    </VStack>
  );
  
  const Contact = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
        const templateParams = {
          from_name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        };
  
        await emailjs.send(
          'service_xze6buo',
          'template_8h2mkp9',
          templateParams,
          'sJibSsHqd8Ovlku3z'
        );
  
        toast({
          title: "Message envoyé",
          description: "Nous vous répondrons dans les plus brefs délais !",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
  
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } catch (error) {
        console.error('Erreur:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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
                Contactez-nous
              </Heading>
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
                Notre équipe est là pour vous aider
              </Text>
            </Stack>
  
            {/* Informations de contact */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <ContactInfo
                icon={FaPhone}
                title="Téléphone"
                content="+216 XX XXX XXX"
                link="tel:+216XXXXXXX"
              />
              <ContactInfo
                icon={FaEnvelope}
                title="Email"
                content="contact@collocation.com"
                link="mailto:contact@collocation.com"
              />
              <ContactInfo
                icon={FaMapMarkerAlt}
                title="Adresse"
                content="Tunis, Tunisie"
              />
            </SimpleGrid>
  
            {/* Formulaire de contact */}
            <Box
              bg={useColorModeValue('white', 'gray.700')}
              p={8}
              borderRadius="lg"
              boxShadow="md"
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isRequired>
                      <FormLabel>Nom complet</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                      />
                    </FormControl>
                  </SimpleGrid>
  
                  <FormControl isRequired>
                    <FormLabel>Sujet</FormLabel>
                    <Select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sélectionnez un sujet"
                    >
                      <option value="support">Support technique</option>
                      <option value="billing">Facturation</option>
                      <option value="partnership">Partenariat</option>
                      <option value="other">Autre</option>
                    </Select>
                  </FormControl>
  
                  <FormControl isRequired>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Votre message..."
                    />
                  </FormControl>
  
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w={{ base: 'full', md: 'auto' }}
                    isLoading={isLoading}
                    loadingText="Envoi en cours..."
                  >
                    Envoyer le message
                  </Button>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Container>
      </Box>
    );
  };
  
  export default Contact;