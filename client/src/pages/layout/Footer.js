import { Box, Container, Stack, Text, Link } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.50" color="gray.700" mt={12}>
      <Container maxW="container.xl" py={8}>
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} justify="space-between">
          <Text>© 2024 Collocation. Tous droits réservés</Text>
          <Stack direction="row" spacing={6}>
            <Link href="#">À propos</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Conditions d'utilisation</Link>
            <Link href="#">Politique de confidentialité</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;