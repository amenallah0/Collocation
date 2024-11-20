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
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      
      toast({
        title: 'Compte créé avec succès',
        description: 'Bienvenue ! Vous pouvez maintenant consulter les annonces.',
        status: 'success',
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
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
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Inscription</Heading>
        
        <FormControl isRequired>
          <FormLabel>Prénom</FormLabel>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Nom</FormLabel>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Téléphone</FormLabel>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mot de passe</FormLabel>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          w="100%"
          isLoading={loading}
        >
          S'inscrire
        </Button>
      </VStack>
    </Box>
  );
};

export default Register; 