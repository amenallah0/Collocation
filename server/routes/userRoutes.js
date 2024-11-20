const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Routes publiques


// Routes protégées
router.get('/:userId/data', auth, userController.getUserData);
router.put('/:userId', auth, userController.updateProfile);
router.delete('/:userId', auth, userController.deleteAccount);

module.exports = router;