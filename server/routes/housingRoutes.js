const express = require('express');
const router = express.Router();
const housingController = require('../controllers/housingController');
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

router.get('/', auth, housingController.getAll);
router.get('/:id', auth, housingController.getById);
router.post('/', auth, upload.array('images', 5), housingController.create);
router.put('/:id', auth, housingController.update);
router.delete('/:id', auth, housingController.delete);

module.exports = router;