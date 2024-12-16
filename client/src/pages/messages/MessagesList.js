import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import messageAPI from '../../api/messageAPI';

const MessagesList = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const bgColor = useColorModeValue('white', 'gray.900');

  useEffect(() => {
    // Fetch messages from the API
    const fetchMessages = async () => {
      try {
        const response = await messageAPI.getUserMessages();
        setMessages(response);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
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
        <Box
          key={message._id}
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={message.read ? 'gray.200' : 'red.500'}
        >
          <Text fontWeight="bold">{message.from.displayName}</Text>
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