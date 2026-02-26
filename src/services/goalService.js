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

export const GoalService = {
  getAll: async (userId) => {
    const goalsQuery = query(collection(db, "users", userId, "goals"));
    const snapshot = await getDocs(goalsQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  add: async (userId, goalData) => {
    const docRef = await addDoc(
      collection(db, "users", userId, "goals"),
      goalData,
    );
    return { id: docRef.id, ...goalData };
  },

  update: async (userId, goalId, updatedData) => {
    const docRef = doc(db, "users", userId, "goals", goalId);
    await setDoc(docRef, updatedData, { merge: true });
  },

  remove: async (userId, goalId) => {
    const docRef = doc(db, "users", userId, "goals", goalId);
    await deleteDoc(docRef);
  },

  getTransactionsByCategory: async (userId, categoryName) => {
    const transactionsQuery = query(
      collection(db, "users", userId, "transactions"),
      where("category", "==", categoryName),
    );
    const snapshot = await getDocs(transactionsQuery);
    return snapshot.docs.map((doc) => doc.data());
  },
};
