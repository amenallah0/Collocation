const Message = require('../models/Message');
const Housing = require('../models/Housing');

const messageController = {
  sendMessage: async (req, res) => {
    try {
      console.log('Received message request:', req.body);
      console.log('User ID from token:', req.userId);

      const { to, housingId, content } = req.body;
      
      if (!content || !to || !housingId) {
        return res.status(400).json({ 
          message: 'Tous les champs sont requis (to, housingId, content)' 
        });
      }

      const recipientId = typeof to === 'object' ? to._id : to;

      if (recipientId.toString() === req.userId.toString()) {
        return res.status(400).json({ 
          message: 'Vous ne pouvez pas envoyer un message à vous-même' 
        });
      }

      const message = new Message({
        from: req.userId, // Utiliser l'ID de l'utilisateur authentifié
        to: recipientId,
        housingId,
        content
      });

      console.log('Creating message:', message);
      
      const savedMessage = await message.save();
      console.log('Message saved:', savedMessage);

      // Peupler le message avec les informations nécessaires
      const populatedMessage = await Message.findById(savedMessage._id)
        .populate('from', 'displayName photoURL')
        .populate('to', 'displayName photoURL')
        .populate('housingId', 'title images');

      // Émettre l'événement avec le message peuplé
      const io = req.app.get('io');
      if (io) {
        io.emit('newMessage', populatedMessage);
      }

      res.status(201).json({ 
        message: 'Message envoyé avec succès',
        data: populatedMessage 
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ 
        message: 'Erreur lors de l\'envoi du message',
        error: error.message 
      });
    }
  },

  getUserMessages: async (req, res) => {
    try {
      const userId = req.userId;
      const messages = await Message.find({
        $or: [{ from: userId }, { to: userId }]
      })
      .populate('from', 'displayName')
      .populate('to', 'displayName')
      .populate('housingId', 'title');

      res.json(messages);
    } catch (error) {
      console.error('Error fetching user messages:', error);
      res.status(500).json({ message: error.message });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.userId;

      // Vérifier si le message existe et appartient à l'utilisateur
      const message = await Message.findById(messageId);
      
      if (!message) {
        return res.status(404).json({ message: 'Message non trouvé' });
      }

      // Vérifier si l'utilisateur est l'expéditeur ou le destinataire du message
      if (message.from.toString() !== userId && message.to.toString() !== userId) {
        return res.status(403).json({ message: 'Non autorisé à supprimer ce message' });
      }

      await Message.findByIdAndDelete(messageId);

      // Émettre l'événement seulement si io est disponible
      const io = req.app.get('io');
      if (io) {
        io.emit('messageDeleted', messageId);
      }

      res.json({ message: 'Message supprimé avec succès' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Ajouter une nouvelle méthode pour supprimer une conversation entière
  deleteConversation: async (req, res) => {
    try {
      const { userId: conversationUserId } = req.params;
      const currentUserId = req.userId;

      // Supprimer tous les messages entre les deux utilisateurs
      const deletedMessages = await Message.deleteMany({
        $or: [
          { from: currentUserId, to: conversationUserId },
          { from: conversationUserId, to: currentUserId }
        ]
      });

      const io = req.app.get('io');
      if (io) {
        io.emit('conversationDeleted', {
          userId: currentUserId,
          conversationUserId
        });
      }

      res.json({ 
        message: 'Conversation supprimée avec succès',
        deletedCount: deletedMessages.deletedCount
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ message: error.message });
    }
  },

  markMessagesAsRead: async (req, res) => {
    try {
      const userId = req.userId;
      
      await Message.updateMany(
        { to: userId, read: false },
        { $set: { read: true } }
      );

      res.json({ message: 'Messages marqués comme lus' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ message: error.message });
    }
  },

  getUnreadMessages: async (req, res) => {
    try {
      const userId = req.userId;
      const unreadMessages = await Message.find({
        to: userId,
        read: false
      })
      .populate('from', 'displayName photoURL')
      .populate('housingId', 'title')
      .sort({ createdAt: -1 });

      res.json(unreadMessages);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = messageController; 