import { useState, useEffect } from "react";
import {
  db,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
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
      // Busca transações na subcoleção do usuário
      const q = query(collection(db, "users", uid, "transactions"));
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

  const addTransaction = async (type, description, value, date, category) => {
    if (!userId) return;
    setLoading(true);
    setMessage("");
    try {
      const newTransaction = {
        type,
        description,
        value,
        date,
        category,
      };
      // Adiciona na subcoleção de transações do usuário
      const docRef = await addDoc(
        collection(db, "users", userId, "transactions"),
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
      // Remove da subcoleção de transações do usuário
      await deleteDoc(doc(db, "users", userId, "transactions", id));
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
      setMessage("Transação removida com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erro ao remover a transação. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return { transactions, loading, message, addTransaction, removeTransaction };
}
