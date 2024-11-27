const Housing = require('../models/Housing');
const User = require('../models/User');

const housingController = {
  getAll: async (req, res) => {
    try {
      const housings = await Housing.find().populate('userId', 'displayName');
      res.json(housings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const housing = await Housing.findById(req.params.id)
        .populate('userId', 'displayName email phone');
      if (!housing) {
        return res.status(404).json({ message: 'Logement non trouvé' });
      }
      res.json(housing);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      // Log pour déboguer
      console.log('Received request body:', req.body);
      console.log('Received files:', req.files);

      // Vérification de l'authentification
      if (!req.userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      // Traitement des images
      const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      // Création du logement
      const housing = new Housing({
        ...req.body,
        userId: req.userId,
        images: imageUrls,
        price: Number(req.body.price),
        surface: Number(req.body.surface),
        bedrooms: Number(req.body.bedrooms)
      });

      const savedHousing = await housing.save();
      
      // Mise à jour de l'utilisateur
      await User.findByIdAndUpdate(req.userId, {
        $push: { housings: savedHousing._id }
      });

      res.status(201).json(savedHousing);
    } catch (error) {
      console.error('Error in housing creation:', error);
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const housing = await Housing.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
      );
      if (!housing) {
        return res.status(404).json({ message: 'Logement non trouvé' });
      }
      res.json(housing);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const housing = await Housing.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
      });
      if (!housing) {
        return res.status(404).json({ message: 'Logement non trouvé' });
      }
      
      // Retirer le logement de la liste des logements de l'utilisateur
      await User.findByIdAndUpdate(req.userId, {
        $pull: { housings: req.params.id }
      });

      res.json({ message: 'Logement supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = housingController;