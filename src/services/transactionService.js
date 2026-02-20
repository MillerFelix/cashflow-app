import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Transaction Service
 * Responsável exclusivo por toda a comunicação com o banco de dados referente a Transações.
 */
export const TransactionService = {
  // 1. Buscar todas as transações
  getAll: async (userId) => {
    const q = query(
      collection(db, "users", userId, "transactions"),
      orderBy("date", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // 2. Adicionar uma única transação
  add: async (userId, transactionData) => {
    const docRef = await addDoc(
      collection(db, "users", userId, "transactions"),
      transactionData,
    );
    return { id: docRef.id, ...transactionData };
  },

  // 3. Adicionar transações fixas (Lote/Batch de 12 meses)
  addFixedBatch: async (userId, transactionData) => {
    const batch = writeBatch(db);
    const newTransactions = [];

    for (let i = 0; i < 12; i++) {
      const baseDate = new Date(transactionData.date + "T00:00:00");
      baseDate.setMonth(baseDate.getMonth() + i);
      const futureDateStr = baseDate.toISOString().split("T")[0];

      const newRef = doc(collection(db, "users", userId, "transactions"));
      const tData = { ...transactionData, date: futureDateStr };

      batch.set(newRef, tData);
      newTransactions.push({ id: newRef.id, ...tData });
    }

    await batch.commit();
    return newTransactions;
  },

  // 4. Editar transação
  update: async (userId, transactionId, updatedData) => {
    const docRef = doc(db, "users", userId, "transactions", transactionId);
    await setDoc(docRef, updatedData, { merge: true });
  },

  // 5. Excluir transação
  remove: async (userId, transactionId) => {
    const docRef = doc(db, "users", userId, "transactions", transactionId);
    await deleteDoc(docRef);
  },
};
