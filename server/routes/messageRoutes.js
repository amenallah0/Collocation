const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/send', auth, messageController.sendMessage);
router.get('/user', auth, messageController.getUserMessages);
router.delete('/:messageId', auth, messageController.deleteMessage);
router.delete('/conversation/:userId', auth, messageController.deleteConversation);
router.put('/markAsRead', auth, messageController.markMessagesAsRead);

module.exports = router; 