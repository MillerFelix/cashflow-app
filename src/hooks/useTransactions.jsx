import { useState, useEffect } from "react";
import {
  db,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "../firebase";

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetchTransactions(userId);
  }, [userId]);

  const fetchTransactions = async (uid) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (type, description, amount, date, category) => {
    if (!userId) return;
    setLoading(true);
    setMessage("");
    try {
      const newTransaction = {
        userId,
        type,
        description,
        amount,
        date,
        category,
      };
      const docRef = await addDoc(
        collection(db, "transactions"),
        newTransaction
      );
      newTransaction.id = docRef.id;
      setTransactions([...transactions, newTransaction]);
      setMessage("Transação salva com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erro ao salvar a transação. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const removeTransaction = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "transactions", id));
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
      setMessage("Transação removida com sucesso!");
      setTimeout(() => setMessage(""), 3000);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Erro ao remover a transação. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return { transactions, loading, message, addTransaction, removeTransaction };
}
