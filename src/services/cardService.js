import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export const CardService = {
  add: async (userId, cardData) => {
    const docRef = await addDoc(collection(db, "cards"), {
      userId,
      ...cardData,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...cardData };
  },

  getAll: async (userId) => {
    const cardsQuery = query(
      collection(db, "cards"),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(cardsQuery);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  update: async (userId, cardId, updatedData) => {
    const cardRef = doc(db, "cards", cardId);
    await updateDoc(cardRef, updatedData);
  },

  remove: async (userId, cardId) => {
    await deleteDoc(doc(db, "cards", cardId));
  },
};
