import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Goal Service
 * Camada responsável pela comunicação com o banco de dados referente a Metas/Orçamentos.
 */
export const GoalService = {
  // 1. Buscar todas as metas do utilizador
  getAll: async (userId) => {
    const q = query(collection(db, "users", userId, "goals"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // 2. Criar uma nova meta
  add: async (userId, goalData) => {
    const docRef = await addDoc(
      collection(db, "users", userId, "goals"),
      goalData,
    );
    return { id: docRef.id, ...goalData };
  },

  // 3. Atualizar uma meta existente (ex: atualizar o valor atual gasto)
  update: async (userId, goalId, updatedData) => {
    const docRef = doc(db, "users", userId, "goals", goalId);
    await setDoc(docRef, updatedData, { merge: true });
  },

  // 4. Remover uma meta
  remove: async (userId, goalId) => {
    const docRef = doc(db, "users", userId, "goals", goalId);
    await deleteDoc(docRef);
  },

  // 5. Função utilitária para buscar transações de uma categoria específica
  // (Usada no momento de criar uma meta para calcular se já há gastos passados)
  getTransactionsByCategory: async (userId, category) => {
    const q = query(
      collection(db, "users", userId, "transactions"),
      where("category", "==", category),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  },
};
