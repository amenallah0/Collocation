const Housing = require('../models/Housing');
const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

const housingController = {
  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalHousings = await Housing.countDocuments();
      const totalPages = Math.ceil(totalHousings / limit);
      
      const housings = await Housing.find()
        .populate('userId', 'displayName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json({
        housings,
        currentPage: page,
        totalPages,
        totalHousings
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      console.log('GetById - Received ID:', req.params.id);
      
      const housing = await Housing.findById(req.params.id)
        .populate('userId', 'displayName email phone');
      
      console.log('GetById - Found housing:', housing);
      
      if (!housing) {
        console.log('GetById - Housing not found');
        return res.status(404).json({ message: 'Logement non trouvé' });
      }
      
      console.log('GetById - Sending response:', housing);
      res.json(housing);
    } catch (error) {
      console.error('GetById - Error:', error);
      res.status(500).json({ message: error.message });
    }
  },

  create: async (req, res) => {
    try {
      console.log('Creating housing - Request body:', req.body);
      console.log('Creating housing - Files:', req.files);

      if (!req.userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      // Validation des champs requis
      const requiredFields = ['title', 'type', 'price', 'surface', 'bedrooms', 'location', 'description'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `Le champ ${field} est requis` });
        }
      }

      // Vérifier si les fichiers ont été uploadés
      const images = req.files ? req.files.map(file => `/uploads/housings/${file.filename}`) : [];
      console.log('Processed images:', images);

      // Traiter les coordonnées
      let coordinates;
      try {
        coordinates = JSON.parse(req.body.coordinates);
      } catch (error) {
        console.error('Error parsing coordinates:', error);
        coordinates = { lat: 0, lng: 0 };
      }

      // Créer l'objet housing
      const housingData = {
        title: req.body.title,
        type: req.body.type,
        price: Number(req.body.price),
        surface: Number(req.body.surface),
        bedrooms: Number(req.body.bedrooms),
        location: req.body.location,
        description: req.body.description,
        coordinates: coordinates,
        images: images,
        userId: req.userId,
        isActive: true
      };

      console.log('Housing data to save:', housingData);

      const housing = new Housing(housingData);
      const savedHousing = await housing.save();
      console.log('Saved housing:', savedHousing);

      res.status(201).json(savedHousing);
    } catch (error) {
      console.error('Error in housing creation:', error);
      
      // Nettoyer les fichiers uploadés en cas d'erreur
      if (req.files) {
        for (const file of req.files) {
          try {
            await fs.unlink(path.join(__dirname, '..', 'uploads', 'housings', file.filename));
          } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
          }
        }
      }

      res.status(500).json({ 
        message: 'Erreur lors de la création du logement',
        error: error.message,
        details: error.stack
      });
    }
  },

  update: async (req, res) => {
    try {
      console.log('Update request body:', req.body);
      console.log('Update request params:', req.params);
      console.log('User ID:', req.userId);

      const housing = await Housing.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        {
          title: req.body.title,
          description: req.body.description,
          price: Number(req.body.price),
          surface: Number(req.body.surface),
          bedrooms: Number(req.body.bedrooms),
          type: req.body.type,
          location: req.body.location
        },
        { new: true, runValidators: true }
      );

      if (!housing) {
        console.log('Housing not found or unauthorized');
        return res.status(404).json({ message: 'Logement non trouvé ou non autorisé' });
      }

      console.log('Updated housing:', housing);
      res.json(housing);
    } catch (error) {
      console.error('Error updating housing:', error);
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
      
      await User.findByIdAndUpdate(req.userId, {
        $pull: { housings: req.params.id }
      });

      res.json({ message: 'Logement supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  toggleFavorite: async (req, res) => {
    try {
      const housingId = req.params.id;
      const userId = req.userId;

      const user = await User.findById(userId);
      const isFavorite = user.favorites.includes(housingId);

      if (isFavorite) {
        // Retirer des favoris
        await User.findByIdAndUpdate(userId, {
          $pull: { favorites: housingId }
        });
      } else {
        // Ajouter aux favoris
        await User.findByIdAndUpdate(userId, {
          $addToSet: { favorites: housingId }
        });
      }

      res.json({ isFavorite: !isFavorite });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = housingController;