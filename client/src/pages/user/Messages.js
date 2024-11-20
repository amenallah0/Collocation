import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Divider,
  useToast
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convs = await messageAPI.getUserConversations(user.uid);
        setConversations(convs);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les conversations',
          status: 'error',
        });
      }
    };
    fetchConversations();
  }, [user.uid, toast]);

  useEffect(() => {
    if (selectedConv) {
      const fetchMessages = async () => {
        const msgs = await messageAPI.getMessages(selectedConv.id);
        setMessages(msgs);
        scrollToBottom();
      };
      fetchMessages();
    }
  }, [selectedConv]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await messageAPI.sendMessage({
        conversationId: selectedConv.id,
        from: user.uid,
        to: selectedConv.participants.find(p => p !== user.uid),
        content: newMessage,
      });
      setNewMessage('');
      // Rafraîchir les messages
      const updatedMsgs = await messageAPI.getMessages(selectedConv.id);
      setMessages(updatedMsgs);
      scrollToBottom();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message',
        status: 'error',
      });
    }
  };

  return (
    <HStack h="600px" spacing={0}>
      {/* Liste des conversations */}
      <Box w="300px" borderRight="1px" borderColor="gray.200" p={4}>
        <VStack align="stretch" spacing={4}>
          {conversations.map(conv => (
            <Box
              key={conv.id}
              p={3}
              cursor="pointer"
              bg={selectedConv?.id === conv.id ? 'blue.50' : 'transparent'}
              _hover={{ bg: 'gray.50' }}
              onClick={() => setSelectedConv(conv)}
            >
              <HStack>
                <Avatar size="sm" name={conv.otherUser.name} src={conv.otherUser.photo} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{conv.otherUser.name}</Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {conv.lastMessage}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Zone de messages */}
      <Box flex={1} h="100%" display="flex" flexDirection="column">
        {selectedConv ? (
          <>
            <Box flex={1} overflowY="auto" p={4}>
              <VStack align="stretch" spacing={4}>
                {messages.map(msg => (
                  <Box
                    key={msg.id}
                    alignSelf={msg.from === user.uid ? 'flex-end' : 'flex-start'}
                    maxW="70%"
                  >
                    <Box
                      bg={msg.from === user.uid ? 'blue.500' : 'gray.100'}
                      color={msg.from === user.uid ? 'white' : 'black'}
                      p={3}
                      borderRadius="lg"
                    >
                      <Text>{msg.content}</Text>
                    </Box>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {format(new Date(msg.createdAt), 'HH:mm')}
                    </Text>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>
            <Divider />
            <HStack p={4}>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} colorScheme="blue">
                Envoyer
              </Button>
            </HStack>
          </>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text color="gray.500">Sélectionnez une conversation</Text>
          </Box>
        )}
      </Box>
    </HStack>
  );
};

export default Messages;