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
  // Adicionar Cartão
  async add(userId, card) {
    try {
      const docRef = await addDoc(collection(db, "cards"), {
        userId,
        ...card,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...card };
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      throw error;
    }
  },

  // Listar Cartões
  async getAll(userId) {
    try {
      const q = query(collection(db, "cards"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      throw error;
    }
  },

  // Editar Cartão
  async update(userId, cardId, updatedData) {
    try {
      const cardRef = doc(db, "cards", cardId);
      await updateDoc(cardRef, updatedData);
    } catch (error) {
      console.error("Erro ao atualizar cartão:", error);
      throw error;
    }
  },

  // Remover Cartão
  async remove(userId, cardId) {
    try {
      await deleteDoc(doc(db, "cards", cardId));
    } catch (error) {
      console.error("Erro ao remover cartão:", error);
      throw error;
    }
  },
};
