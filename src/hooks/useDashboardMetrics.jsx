import React, { useMemo } from "react";
import {
  FaFireAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { processCardInvoices } from "../utils/cardUtils";

export function useDashboardMetrics(transactions, userProfile, cards = []) {
  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split("T")[0];
  const currentMonthYear = todayStr.substring(0, 7);

  const todayFormatted = todayDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const globalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.date > todayStr) return acc;
      if (t.type === "credit") return acc + t.value;

      // Se for débito/saída:
      if (t.paymentMethod === "credit") return acc; // Cartão de crédito não tira dinheiro na hora
      return acc - t.value;
    }, 0);
  }, [transactions, todayStr]);

  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(currentMonthYear)),
    [transactions, currentMonthYear],
  );

  const { realizedIncome, realizedExpense, futureIncome, futureExpense } =
    useMemo(() => {
      return monthTransactions.reduce(
        (acc, t) => {
          const isFuture = t.date > todayStr;
          if (t.type === "credit") {
            isFuture
              ? (acc.futureIncome += t.value)
              : (acc.realizedIncome += t.value);
          } else {
            if (t.category === "Pagamento de Cartão") return acc;

            isFuture
              ? (acc.futureExpense += t.value)
              : (acc.realizedExpense += t.value);
          }
          return acc;
        },
        {
          realizedIncome: 0,
          realizedExpense: 0,
          futureIncome: 0,
          futureExpense: 0,
        },
      );
    }, [monthTransactions, todayStr]);

  const totalMonthIncome = realizedIncome + futureIncome;
  const totalMonthExpenseSoFar = realizedExpense;

  const pendingInvoicesTotal = useMemo(() => {
    if (!cards || cards.length === 0) return 0;
    const processed = processCardInvoices(cards, transactions);
    return processed.reduce((acc, card) => {
      if (card.openInvoice && !card.openInvoice.isPaid) {
        return acc + card.openInvoice.total;
      }
      return acc;
    }, 0);
  }, [cards, transactions]);

  const projectedBalance = useMemo(() => {
    let futureCashIncome = 0;
    let futureCashExpense = 0;

    transactions.forEach((t) => {
      if (t.date > todayStr && t.date.startsWith(currentMonthYear)) {
        if (t.type === "credit") futureCashIncome += t.value;
        else if (t.paymentMethod !== "credit") {
          futureCashExpense += t.value;
        }
      }
    });

    return (
      globalBalance +
      futureCashIncome -
      futureCashExpense -
      pendingInvoicesTotal
    );
  }, [
    globalBalance,
    transactions,
    todayStr,
    currentMonthYear,
    pendingInvoicesTotal,
  ]);

  const daysUntilPayday = useMemo(() => {
    const payDays = [];
    if (userProfile.payDay) payDays.push(userProfile.payDay);
    if (userProfile.payDay2) payDays.push(userProfile.payDay2);
    if (payDays.length === 0) return null;

    const todayDay = todayDate.getDate();
    let minDays = Infinity;

    payDays.forEach((day) => {
      let diff;
      if (todayDay < day) diff = day - todayDay;
      else {
        const nextMonth = new Date(
          todayDate.getFullYear(),
          todayDate.getMonth() + 1,
          day,
        );
        const diffTime = Math.abs(nextMonth - todayDate);
        diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      if (diff < minDays) minDays = diff;
    });
    return minDays;
  }, [userProfile.payDay, userProfile.payDay2]);

  const financialPace = useMemo(() => {
    if (totalMonthIncome === 0)
      return { status: "neutral", message: "Sem receitas este mês." };

    const daysInMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth() + 1,
      0,
    ).getDate();
    const dayOfMonth = todayDate.getDate();
    const monthProgress = dayOfMonth / daysInMonth;
    const spendingProgress = totalMonthExpenseSoFar / totalMonthIncome;
    const difference = spendingProgress - monthProgress;

    let dangerThreshold = 0.15;
    let warningThreshold = 0.05;
    if (userProfile.financialFocus === "debt") {
      dangerThreshold = 0.1;
      warningThreshold = 0.02;
    } else if (userProfile.financialFocus === "invest") {
      dangerThreshold = 0.12;
    }

    if (spendingProgress > 0.95)
      return {
        status: "danger",
        icon: <FaFireAlt />,
        color: "red",
        title: "Esgotado",
        message: "Você já consumiu quase toda sua renda mensal.",
      };
    if (difference > dangerThreshold)
      return {
        status: "danger",
        icon: <FaFireAlt />,
        color: "red",
        title: "Ritmo Acelerado",
        message: "Freie agora! Seus gastos estão muito rápidos.",
      };
    if (difference > warningThreshold)
      return {
        status: "warning",
        icon: <FaExclamationTriangle />,
        color: "yellow",
        title: "Atenção",
        message: "Você está gastando um pouco acima do ideal.",
      };

    let successMsg = "Seu ritmo está saudável.";
    if (userProfile.financialFocus === "invest")
      successMsg = "Excelente! Sobrando dinheiro para investir.";
    if (userProfile.financialFocus === "debt")
      successMsg = "Ótimo! Você está economizando como planejado.";

    return {
      status: "success",
      icon: <FaCheckCircle />,
      color: "green",
      title: "No Controle",
      message: successMsg,
    };
  }, [totalMonthIncome, totalMonthExpenseSoFar, userProfile.financialFocus]);

  const smartInsight = useMemo(() => {
    if (globalBalance < 0)
      return {
        type: "alert",
        text: "Sua conta está negativa. Priorize cobrir o saldo.",
      };
    if (
      daysUntilPayday !== null &&
      daysUntilPayday <= 7 &&
      daysUntilPayday > 0
    ) {
      if (globalBalance < 200)
        return {
          type: "warning",
          text: `Faltam ${daysUntilPayday} dias para cair dinheiro. Segure os gastos!`,
        };
      return {
        type: "info",
        text: `Faltam ${daysUntilPayday} dias para a próxima entrada. Você tem ${formatCurrency(globalBalance)} disponível.`,
      };
    }
    if (
      userProfile.workModel === "autonomo" ||
      userProfile.workModel === "pj"
    ) {
      if (futureIncome === 0)
        return {
          type: "tip",
          text: "Como autônomo, não esqueça de registrar suas entradas previstas.",
        };
    }
    if (futureExpense > globalBalance)
      return {
        type: "warning",
        text: "Atenção: Seus agendamentos futuros superam seu saldo atual.",
      };

    return {
      type: "tip",
      text: "Mantenha o foco! Gastar com consciência é o caminho.",
    };
  }, [
    globalBalance,
    daysUntilPayday,
    userProfile,
    futureExpense,
    futureIncome,
  ]);

  const categoryRanking = useMemo(() => {
    const expenses = monthTransactions.filter(
      (t) => t.type === "debit" && t.category !== "Pagamento de Cartão",
    );
    const grouped = expenses.reduce((acc, t) => {
      const key = t.subcategory || t.category;
      acc[key] = (acc[key] || 0) + t.value;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / (realizedExpense || 1)) * 100,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [monthTransactions, realizedExpense]);

  return {
    todayFormatted,
    formatCurrency,
    globalBalance,
    projectedBalance,
    daysUntilPayday,
    financialPace,
    smartInsight,
    categoryRanking,
    futureExpense,
  };
}
