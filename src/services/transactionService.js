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
 * Serviço responsável por gerenciar as transações no Firestore.
 */
export const TransactionService = {
  getAll: async (userId) => {
    const transactionsQuery = query(
      collection(db, "users", userId, "transactions"),
      orderBy("date", "desc"),
    );
    const snapshot = await getDocs(transactionsQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  add: async (userId, transactionData) => {
    const docRef = await addDoc(
      collection(db, "users", userId, "transactions"),
      transactionData,
    );
    return { id: docRef.id, ...transactionData };
  },

  addFixedBatch: async (userId, transactionData) => {
    const batch = writeBatch(db);
    const newTransactions = [];

    // Cria 12 meses de recorrência baseados na data inicial
    for (let i = 0; i < 12; i++) {
      const baseDate = new Date(`${transactionData.date}T00:00:00`);
      baseDate.setMonth(baseDate.getMonth() + i);

      const futureDateStr = baseDate.toISOString().split("T")[0];
      const newDocRef = doc(collection(db, "users", userId, "transactions"));

      const recurringTransaction = { ...transactionData, date: futureDateStr };

      batch.set(newDocRef, recurringTransaction);
      newTransactions.push({ id: newDocRef.id, ...recurringTransaction });
    }

    await batch.commit();
    return newTransactions;
  },

  update: async (userId, transactionId, updatedData) => {
    const docRef = doc(db, "users", userId, "transactions", transactionId);
    await setDoc(docRef, updatedData, { merge: true });
  },

  remove: async (userId, transactionId) => {
    const docRef = doc(db, "users", userId, "transactions", transactionId);
    await deleteDoc(docRef);
  },
};
