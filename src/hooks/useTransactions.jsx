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
      setMessage("Erro ao carregar transações.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Helper para padronizar o envio de mensagens na UI
  const showTemporaryMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), duration);
  };

  const addTransaction = useCallback(
    async (transactionData) => {
      if (!userId) return;

      setLoading(true);
      setMessage("");

      try {
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

        const transactionPayload = {
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
            transactionPayload,
          );
          setTransactions((prev) =>
            [...prev, ...newTransactions].sort((a, b) =>
              b.date > a.date ? 1 : -1,
            ),
          );
        } else {
          const newTransaction = await TransactionService.add(
            userId,
            transactionPayload,
          );
          setTransactions((prev) =>
            [...prev, newTransaction].sort((a, b) =>
              b.date > a.date ? 1 : -1,
            ),
          );
        }

        await updateGoalsAchievement(userId, category, value, date);
        showTemporaryMessage(
          isFixed ? "Série de pagamentos agendada!" : "Transação registrada!",
        );
      } catch (error) {
        console.error("Erro ao salvar transação:", error);
        showTemporaryMessage("Erro ao salvar transação.");
      } finally {
        setLoading(false);
      }
    },
    [userId, updateGoalsAchievement],
  );

  const editTransaction = useCallback(
    async (transactionId, updatedData) => {
      if (!userId) return;

      setLoading(true);
      try {
        await TransactionService.update(userId, transactionId, updatedData);
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, ...updatedData }
              : transaction,
          ),
        );
        showTemporaryMessage("Transação atualizada com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar transação:", error);
        showTemporaryMessage("Erro ao atualizar transação.");
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const confirmTransactionValue = useCallback(
    async (transactionId, confirmedValue) => {
      if (!userId) return;

      setLoading(true);
      try {
        const updates = { value: confirmedValue, isConfirmed: true };
        await TransactionService.update(userId, transactionId, updates);
        setTransactions((prev) =>
          prev.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, ...updates }
              : transaction,
          ),
        );
        showTemporaryMessage("Valor confirmado com sucesso!");
      } catch (error) {
        console.error("Erro ao confirmar valor:", error);
        showTemporaryMessage("Erro ao confirmar o valor.");
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  const removeTransaction = useCallback(
    async (transactionId) => {
      if (!userId) return;

      try {
        await TransactionService.remove(userId, transactionId);
        setTransactions((prev) =>
          prev.filter((transaction) => transaction.id !== transactionId),
        );
        showTemporaryMessage("Transação removida!");
      } catch (error) {
        console.error("Erro ao remover transação:", error);
        showTemporaryMessage("Erro ao remover transação.");
      }
    },
    [userId],
  );

  const cancelFutureFixedTransactions = useCallback(
    async (referenceTransaction) => {
      if (!userId) return;

      setLoading(true);
      try {
        const futureTransactions = transactions.filter(
          (transaction) =>
            transaction.isFixed &&
            transaction.description === referenceTransaction.description &&
            transaction.date >= referenceTransaction.date,
        );

        await Promise.all(
          futureTransactions.map((transaction) =>
            TransactionService.remove(userId, transaction.id),
          ),
        );

        const idsToRemove = futureTransactions.map((t) => t.id);
        setTransactions((prev) =>
          prev.filter((t) => !idsToRemove.includes(t.id)),
        );

        showTemporaryMessage("Assinatura cancelada com sucesso!", 4000);
      } catch (error) {
        console.error("Erro ao cancelar assinatura:", error);
        showTemporaryMessage("Erro ao cancelar assinatura.");
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
