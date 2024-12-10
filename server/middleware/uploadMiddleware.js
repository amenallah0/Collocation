const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads/housings s'il n'existe pas
const uploadDir = path.join(__dirname, '../uploads/housings');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez JPG, PNG ou GIF.'));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  }
});

module.exports = upload;