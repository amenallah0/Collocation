import { 
  Box, 
  Container, 
  Stack, 
  Text, 
  Link, 
  IconButton, 
  Divider, 
  useColorModeValue,
  VStack,
  SimpleGrid,
  Button,
  Input,
  FormControl,
  useToast,
  Tooltip,
  useBreakpointValue,
  Flex
} from '@chakra-ui/react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Composant pour les sections du footer
const FooterSection = ({ title, children }) => (
  <VStack align="flex-start" spacing={3}>
    <Text 
      fontWeight="bold" 
      fontSize="lg"
      bgGradient="linear(to-r, brand.500, brand.300)"
      bgClip="text"
    >
      {title}
    </Text>
    {children}
  </VStack>
);

// Composant pour les liens du footer
const FooterLink = ({ href, children }) => (
  <Link
    as={RouterLink}
    to={href}
    fontSize="sm"
    _hover={{ 
      color: 'brand.500', 
      textDecoration: 'none',
      transform: 'translateX(5px)',
      transition: 'all 0.3s ease'
    }}
    display="flex"
    alignItems="center"
    gap={2}
  >
    {children}
  </Link>
);

// Composant pour les icônes sociales
const SocialIcon = ({ icon: Icon, label, url }) => (
  <Tooltip label={label} hasArrow>
    <IconButton
      as="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      icon={<Icon />}
      size="sm"
      variant="ghost"
      _hover={{ 
        color: 'brand.500',
        transform: 'translateY(-2px)',
        transition: 'all 0.3s ease'
      }}
    />
  </Tooltip>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Styles
  const styles = {
    bg: useColorModeValue('gray.50', 'gray.800'),
    text: useColorModeValue('gray.700', 'gray.200'),
    border: useColorModeValue('gray.200', 'gray.700'),
    inputBg: useColorModeValue('white', 'gray.700'),
    descriptionColor: useColorModeValue('gray.600', 'gray.400')
  };

  // Données
  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', url: '#' },
    { icon: FaTwitter, label: 'Twitter', url: '#' },
    { icon: FaInstagram, label: 'Instagram', url: '#' },
    { icon: FaLinkedin, label: 'LinkedIn', url: '#' }
  ];

  const contactInfo = [
    { icon: FaPhone, text: '+216 XX XXX XXX', url: 'tel:+216XXXXXXX' },
    { icon: FaEnvelope, text: 'contact@collocation.com', url: 'mailto:contact@collocation.com' },
    { icon: FaMapMarkerAlt, text: 'Tunis, Tunisie', url: 'https://goo.gl/maps/xxx' }
  ];

  const footerSections = {
    about: [
      { text: 'À propos de nous', url: '/about' },
      { text: 'Notre équipe', url: '/team' },
      { text: 'Carrières', url: '/careers' }
    ],
    support: [
      { text: "Centre d'aide", url: '/help' },
      { text: 'FAQ', url: '/faq' },
      { text: 'Contact', url: '/contact' }
    ],
    legal: [
      { text: "Conditions d'utilisation", url: '/terms' },
      { text: 'Politique de confidentialité', url: '/privacy' },
      { text: 'Mentions légales', url: '/legal' }
    ]
  };

  // Handlers
  const handleNewsletterSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Succès",
        description: "Merci de votre inscription à notre newsletter !",
        status: "success",
        duration: 3000,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [email, toast]);

  return (
    <Box 
      as="footer" 
      bg={styles.bg} 
      color={styles.text}
      borderTop="1px"
      borderColor={styles.border}
      mt={12}
    >
      <Container maxW="container.xl" py={12}>
        <Stack spacing={12}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
            {/* Logo et description */}
            <VStack align="flex-start" spacing={4}>
              <Text 
                fontSize="2xl" 
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, brand.300)"
                bgClip="text"
              >
                Collocation
              </Text>
              <Text fontSize="sm" color={styles.descriptionColor}>
                Trouvez la colocation idéale en toute simplicité. 
                Rejoignez notre communauté grandissante.
              </Text>
              {/* Contact Info */}
              <VStack align="start" spacing={2}>
                {contactInfo.map((info, index) => (
                  <FooterLink key={index} href={info.url}>
                    <info.icon />
                    {info.text}
                  </FooterLink>
                ))}
              </VStack>
            </VStack>

            {/* Sections de liens */}
            <FooterSection title="À propos">
              {footerSections.about.map((link, index) => (
                <FooterLink key={index} href={link.url}>
                  {link.text}
                </FooterLink>
              ))}
            </FooterSection>

            <FooterSection title="Support">
              {footerSections.support.map((link, index) => (
                <FooterLink key={index} href={link.url}>
                  {link.text}
                </FooterLink>
              ))}
            </FooterSection>

            {/* Newsletter */}
            <FooterSection title="Newsletter">
              <form onSubmit={handleNewsletterSubmit} style={{ width: '100%' }}>
                <Stack spacing={3}>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg={styles.inputBg}
                      _hover={{ borderColor: 'brand.500' }}
                    />
                  </FormControl>
                  <Button 
                    type="submit"
                    leftIcon={<FaEnvelope />}
                    colorScheme="brand"
                    w="full"
                    isLoading={isSubmitting}
                    loadingText="Inscription..."
                  >
                    S'inscrire
                  </Button>
                </Stack>
              </form>
            </FooterSection>
          </SimpleGrid>

          <Divider borderColor={styles.border} />

          {/* Copyright et réseaux sociaux */}
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text fontSize="sm">
              © {new Date().getFullYear()} Collocation. Tous droits réservés
            </Text>
            <Stack direction="row" spacing={4}>
              {socialLinks.map((social, index) => (
                <SocialIcon key={index} {...social} />
              ))}
            </Stack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;