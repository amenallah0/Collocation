const User = require('../models/User');
const jwt = require('jsonwebtoken');

const userController = {
  // Créer un utilisateur
  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      const user = new User({
        email,
        password,
        firstName,
        lastName,
        phone,
        displayName: `${firstName} ${lastName}`
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          displayName: user.displayName
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Connexion
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await User.findOne({ email })
      
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log("token",token);
      res.json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          displayName: user.displayName,
      
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les données utilisateur
  getUserData: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
        .populate('housings')
        .populate('favorites');
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          displayName: user.displayName
        },
        housings: user.housings,
        favorites: user.favorites
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour le profil
  updateProfile: async (req, res) => {
    try {
      const updates = req.body;
      delete updates.password; // Empêcher la modification du mot de passe par cette route

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { ...updates, displayName: `${updates.firstName} ${updates.lastName}` },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        displayName: user.displayName
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Supprimer un compte
  deleteAccount: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController;