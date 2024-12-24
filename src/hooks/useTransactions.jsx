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
  writeBatch,
} from "../firebase";

// Atualização na hook de transações para sincronizar metas
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

      const docRef = await addDoc(
        collection(db, "users", userId, "transactions"),
        newTransaction
      );
      newTransaction.id = docRef.id;
      setTransactions([...transactions, newTransaction]);

      // Atualiza metas relacionadas à categoria
      await updateGoalsProgress(userId, category, value, date);

      setMessage("Transação salva com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erro ao salvar a transação. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const updateGoalsProgress = async (uid, category, value, date) => {
    try {
      const q = query(
        collection(db, "users", uid, "goals"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);

      const goalsToUpdate = querySnapshot.docs.filter((doc) => {
        const goal = doc.data();
        const goalStartDate = new Date(goal.startDate); // Converte a string para objeto Date
        const goalEndDate = new Date(goal.endDate); // Converte a string para objeto Date
        const transactionDate = new Date(date); // A data da transação

        // Verifica se a data da transação está dentro do intervalo da meta
        return (
          transactionDate >= goalStartDate && transactionDate <= goalEndDate
        );
      });

      const batch = writeBatch(db);
      goalsToUpdate.forEach((doc) => {
        const goal = doc.data();
        const updatedValue = goal.currentValue + value;
        const progress = (updatedValue / goal.goalValue) * 100;
        batch.update(doc.ref, {
          currentValue: updatedValue,
          progress: progress > 100 ? 100 : progress,
        });
      });
      await batch.commit();
    } catch (error) {
      console.error("Erro ao atualizar progresso das metas:", error);
    }
  };

  const removeTransaction = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const transactionToRemove = transactions.find((t) => t.id === id);
      await deleteDoc(doc(db, "users", userId, "transactions", id));

      // Reverter progresso da meta associada
      if (transactionToRemove) {
        await updateGoalsProgress(
          userId,
          transactionToRemove.category,
          -transactionToRemove.value,
          transactionToRemove.date
        );
      }

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
