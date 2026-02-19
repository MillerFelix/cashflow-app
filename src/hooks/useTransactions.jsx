import { useState, useEffect, useCallback } from "react";
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

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 1. useCallback: Memoriza a função de busca para não recriá-la à toa
  const fetchTransactions = useCallback(async (uid) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users", uid, "transactions"),
        orderBy("date", "desc"),
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
  }, []); // Array vazio: essa função não depende de variáveis externas mutáveis

  useEffect(() => {
    if (!userId) return;
    fetchTransactions(userId);
  }, [userId, fetchTransactions]);

  // 2. useCallback: Memoriza a função de atualizar as metas
  const updateGoalsAchievement = useCallback(
    async (uid, category, value, date) => {
      try {
        const q = query(
          collection(db, "users", uid, "goals"),
          where("category", "==", category),
        );
        const querySnapshot = await getDocs(q);

        const goalsToUpdate = querySnapshot.docs.filter((doc) => {
          const goal = doc.data();
          const goalStartDate = new Date(goal.startDate);
          const goalEndDate = new Date(goal.endDate);
          const transactionDate = new Date(date);

          return (
            transactionDate >= goalStartDate && transactionDate <= goalEndDate
          );
        });

        const batch = writeBatch(db);
        goalsToUpdate.forEach((doc) => {
          const goal = doc.data();
          const updatedValue = goal.currentValue + value;
          const achievement = (updatedValue / goal.goalValue) * 100;
          batch.update(doc.ref, {
            currentValue: updatedValue,
            achievement: achievement > 100 ? 100 : achievement,
          });
        });
        await batch.commit();
      } catch (error) {
        console.error("Erro ao atualizar progresso das metas:", error);
      }
    },
    [],
  );

  // 3. useCallback: Memoriza a adição de transações
  const addTransaction = useCallback(
    async (type, description, value, date, category) => {
      if (!userId) return;
      setLoading(true);
      setMessage("");
      try {
        const newTransaction = { type, description, value, date, category };

        const docRef = await addDoc(
          collection(db, "users", userId, "transactions"),
          newTransaction,
        );
        newTransaction.id = docRef.id;

        setTransactions((prevTransactions) => {
          const updatedTransactions = [...prevTransactions, newTransaction];
          return updatedTransactions.sort((a, b) => (b.date > a.date ? 1 : -1));
        });

        await updateGoalsAchievement(userId, category, value, date);

        setMessage("Transação salva com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("Erro ao salvar a transação. Tente novamente!");
      } finally {
        setLoading(false);
      }
    },
    [userId, updateGoalsAchievement],
  );

  // 4. useCallback: Memoriza a remoção
  const removeTransaction = useCallback(
    async (id) => {
      if (!id || !userId) return;
      setLoading(true);
      try {
        // Pega a transação direto do estado atual (sem precisar colocar 'transactions' como dependência)
        let transactionToRemove = null;
        setTransactions((prevTransactions) => {
          transactionToRemove = prevTransactions.find((t) => t.id === id);
          return prevTransactions.filter(
            (transaction) => transaction.id !== id,
          );
        });

        await deleteDoc(doc(db, "users", userId, "transactions", id));

        if (transactionToRemove) {
          await updateGoalsAchievement(
            userId,
            transactionToRemove.category,
            -transactionToRemove.value,
            transactionToRemove.date,
          );
        }

        setMessage("Transação removida com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("Erro ao remover a transação. Tente novamente!");
      } finally {
        setLoading(false);
      }
    },
    [userId, updateGoalsAchievement],
  );

  return { transactions, loading, message, addTransaction, removeTransaction };
}
