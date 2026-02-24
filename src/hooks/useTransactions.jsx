import { useState, useCallback, useEffect } from "react";
import { TransactionService } from "../services/transactionService";
import useGoals from "./useGoals";

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { updateGoalsAchievement } = useGoals();

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await TransactionService.getAll(userId);
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      setMessage("Erro ao buscar transações.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(
    async (transactionData) => {
      if (!userId) return;
      setLoading(true);
      setMessage("");
      try {
        // Desestruturação segura incluindo cardId
        const {
          type,
          description,
          value,
          date,
          category,
          subcategory = "",
          isFixed = false,
          paymentMethod = "debit",
          cardId = null,
        } = transactionData;

        const tData = {
          type,
          description,
          value,
          date,
          category,
          subcategory,
          isFixed,
          paymentMethod,
          cardId,
          isConfirmed: !isFixed,
        };

        if (isFixed) {
          const newTransactions = await TransactionService.addFixedBatch(
            userId,
            tData,
          );
          setTransactions((prev) =>
            [...prev, ...newTransactions].sort((a, b) =>
              b.date > a.date ? 1 : -1,
            ),
          );
        } else {
          const newTransaction = await TransactionService.add(userId, tData);
          setTransactions((prev) =>
            [...prev, newTransaction].sort((a, b) =>
              b.date > a.date ? 1 : -1,
            ),
          );
        }

        await updateGoalsAchievement(userId, category, value, date);
        setMessage(
          isFixed ? "Série de pagamentos agendada!" : "Transação registrada!",
        );
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error(error);
        setMessage("Erro ao salvar.");
      } finally {
        setLoading(false);
      }
    },
    [userId, updateGoalsAchievement],
  );

  const editTransaction = useCallback(
    async (id, updatedData) => {
      if (!userId) return;
      setLoading(true);
      try {
        await TransactionService.update(userId, id, updatedData);
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)),
        );
        setMessage("Atualizado com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error(error);
        setMessage("Erro ao atualizar.");
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const confirmTransactionValue = useCallback(
    async (id, confirmedValue) => {
      if (!userId) return;
      setLoading(true);
      try {
        const updates = { value: confirmedValue, isConfirmed: true };
        await TransactionService.update(userId, id, updates);
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        );
        setMessage("Valor confirmado e atualizado!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error(error);
        setMessage("Erro ao confirmar valor.");
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const removeTransaction = useCallback(
    async (id) => {
      if (!userId) return;
      try {
        await TransactionService.remove(userId, id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        setMessage("Removido com sucesso!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Erro ao remover:", error);
      }
    },
    [userId],
  );

  const cancelFutureFixedTransactions = useCallback(
    async (transaction) => {
      if (!userId) return;
      setLoading(true);
      try {
        const futureTxs = transactions.filter(
          (t) =>
            t.isFixed === true &&
            t.description === transaction.description &&
            t.date >= transaction.date,
        );
        await Promise.all(
          futureTxs.map((t) => TransactionService.remove(userId, t.id)),
        );
        const idsToRemove = futureTxs.map((t) => t.id);
        setTransactions((prev) =>
          prev.filter((t) => !idsToRemove.includes(t.id)),
        );
        setMessage("Assinatura cancelada! Cobranças futuras removidas.");
        setTimeout(() => setMessage(""), 4000);
      } catch (error) {
        console.error("Erro ao cancelar assinatura:", error);
        setMessage("Erro ao cancelar as cobranças futuras.");
      } finally {
        setLoading(false);
      }
    },
    [userId, transactions],
  );

  return {
    transactions,
    loading,
    message,
    fetchTransactions,
    addTransaction,
    removeTransaction,
    editTransaction,
    confirmTransactionValue,
    cancelFutureFixedTransactions,
  };
}
