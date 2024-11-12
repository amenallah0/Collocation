import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
  Link,
  useToast
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { firebaseAuth } from '../../services/firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const userCredential = await firebaseAuth.signUp(email, password);
      await firebaseAuth.updateUserProfile(userCredential.user, {
        displayName: email.split('@')[0]
      });
      
      toast({
        title: 'Compte créé avec succès',
        status: 'success',
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Erreur d\'inscription',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={8} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Heading size="lg">Inscription</Heading>
        
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          w="100%"
          onClick={handleSubmit}
          isLoading={loading}
        >
          S'inscrire
        </Button>

        <Text>
          Déjà un compte ?{' '}
          <Link as={RouterLink} to="/login" color="blue.500">
            Connectez-vous
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Register; 