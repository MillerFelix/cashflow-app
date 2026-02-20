import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Category Service
 * Responsável por gerir as Subcategorias personalizadas criadas pelo utilizador.
 */
export const CategoryService = {
  // 1. Buscar todas as subcategorias do utilizador
  getSubcategories: async (userId) => {
    const q = query(
      collection(db, "users", userId, "subcategories"),
      orderBy("name", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // 2. Criar uma nova subcategoria
  addSubcategory: async (userId, parentCategory, name) => {
    const newSub = {
      parentCategory,
      name,
      isActive: true, // Para no futuro podermos ocultar sem apagar o histórico
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(
      collection(db, "users", userId, "subcategories"),
      newSub,
    );
    return { id: docRef.id, ...newSub };
  },

  // 3. Atualizar (Renomear, Ocultar, Mover)
  updateSubcategory: async (userId, subcategoryId, updatedData) => {
    const docRef = doc(db, "users", userId, "subcategories", subcategoryId);
    await setDoc(docRef, updatedData, { merge: true });
  },
};
