import { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
    useToast,
    Heading,
    InputGroup,
    InputRightElement,
    IconButton
  } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Connexion réussie',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: error.message || "Email ou mot de passe incorrect",
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
        <Heading size="lg">Connexion</Heading>

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
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
            />
            <InputRightElement>
              <IconButton
                icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Cacher' : 'Montrer'}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width="full"
          onClick={handleSubmit}
          isLoading={loading}
        >
          Se connecter
        </Button>

        <Text>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: 'blue.500' }}>
            S'inscrire
          </Link>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login; 