import { useState, useEffect } from "react";
import {
  db,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
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

  async function fetchTransactions(uid) {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users", uid, "transactions"),
        orderBy("date", "desc") // Ordena por data mais recente
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
  }

  async function addTransaction(type, description, value, date, category) {
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

      // Atualiza a lista de transações ordenada
      setTransactions((prevTransactions) => {
        const updatedTransactions = [...prevTransactions, newTransaction];
        return updatedTransactions.sort((a, b) => (b.date > a.date ? 1 : -1)); // Ordena pela data
      });

      // Atualiza metas relacionadas à categoria
      await updateGoalsProgress(userId, category, value, date);

      setMessage("Transação salva com sucesso!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erro ao salvar a transação. Tente novamente!");
    } finally {
      setLoading(false);
    }
  }

  async function updateGoalsProgress(uid, category, value, date) {
    try {
      const q = query(
        collection(db, "users", uid, "goals"),
        where("category", "==", category)
      );
      const querySnapshot = await getDocs(q);

      const goalsToUpdate = querySnapshot.docs.filter((doc) => {
        const goal = doc.data();
        const goalStartDate = new Date(goal.startDate);
        const goalEndDate = new Date(goal.endDate);
        const transactionDate = new Date(date);

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
  }

  async function removeTransaction(id) {
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
  }

  return { transactions, loading, message, addTransaction, removeTransaction };
}
