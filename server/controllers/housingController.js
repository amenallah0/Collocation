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
      console.log('Received request body:', req.body);
      console.log('Received files:', req.files);

      if (!req.userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      if (!req.files || req.files.length === 0) {
        console.log('No files uploaded');
      }

      const imageUrls = req.files ? req.files.map(file => `/uploads/housings/${file.filename}`) : [];
      console.log('Image URLs:', imageUrls);

      const housing = new Housing({
        ...req.body,
        userId: req.userId,
        images: imageUrls,
        price: Number(req.body.price),
        surface: Number(req.body.surface),
        bedrooms: Number(req.body.bedrooms)
      });

      console.log('Housing object before save:', housing);

      const savedHousing = await housing.save();
      console.log('Saved housing:', savedHousing);

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
  }
};

module.exports = housingController;