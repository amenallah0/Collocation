import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';

const MessagesList = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    // TODO: Implémenter la logique de chargement des messages
    // Cette fonctionnalité sera développée plus tard
    setMessages([]);
  }, [userId]);

  if (messages.length === 0) {
    return (
      <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px">
        <Text>Aucun message pour le moment</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {messages.map((message) => (
        <Box key={message._id} p={4} bg={bgColor} borderRadius="lg" borderWidth="1px">
          <Text fontWeight="bold">{message.from}</Text>
          <Text>{message.content}</Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(message.createdAt).toLocaleDateString()}
          </Text>
        </Box>
      ))}
    </VStack>
  );
};

export default MessagesList;