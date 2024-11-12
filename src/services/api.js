import { db, storage } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { mockHousings } from '../data/mockHousings';

export const housingAPI = {
  // Créer une nouvelle annonce
  createHousing: async (housingData, images) => {
    const imageUrls = [];
    
    // Upload des images
    for (const image of images) {
      const storageRef = ref(storage, `houses/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }

    // Créer l'annonce avec les URLs des images
    const docRef = await addDoc(collection(db, 'housing'), {
      ...housingData,
      images: imageUrls,
      createdAt: new Date(),
      isActive: true
    });
    
    return docRef.id;
  },

  // Récupérer toutes les annonces actives
  getActiveHousings: async () => {
    const q = query(collection(db, 'housing'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  getHousingById: async (id) => {
    // Pour les données mockées
    const housing = mockHousings.find(h => h.id === id);
    if (!housing) {
      throw new Error('Annonce non trouvée');
    }
    return housing;
  },
  // Mettre à jour une annonce
  updateHousing: async (id, data) => {
    const docRef = doc(db, 'housing', id);
    await updateDoc(docRef, data);
  },

  // Supprimer une annonce
  deleteHousing: async (id) => {
    await deleteDoc(doc(db, 'housing', id));
  }
};

export const messageAPI = {
  // Envoyer un message
  sendMessage: async (message) => {
    return await addDoc(collection(db, 'messages'), {
      ...message,
      createdAt: new Date()
    });
  },

  // Récupérer les messages d'une conversation
  getMessages: async (conversationId) => {
    const q = query(
      collection(db, 'messages'),
      where('conversationId', '==', conversationId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
export const userAPI = {
  getUserProfile: async (userId) => {
    // Implémentez la logique pour récupérer le profil utilisateur
  },
  
  updateUserProfile: async (userId, profileData) => {
    // Implémentez la logique pour mettre à jour le profil utilisateur
  }
};