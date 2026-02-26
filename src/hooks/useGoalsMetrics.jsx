import { useMemo } from "react";
import { expenseCategories } from "../components/category/CategoryList";

const ESSENTIAL_CATEGORIES = [
  "Moradia",
  "Alimentação",
  "Mercado",
  "Transporte",
  "Saúde",
  "Seguros",
  "Impostos e Taxas",
  "Educação",
  "Serviços",
];

export function useGoalsMetrics(transactions, goals) {
  // 1. Cálculos do Raio-X Financeiro
  const { costOfLiving, emergencyFund, totalIncome } = useMemo(() => {
    if (!transactions || !transactions.length) {
      return { costOfLiving: 0, emergencyFund: 0, totalIncome: 0 };
    }

    const expensesByMonth = {};
    let totalIncomeCalc = 0;
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);

    transactions.forEach((t) => {
      if (t.category === "Pagamento de Cartão") return;

      const monthKey = t.date.slice(0, 7);

      if (t.type === "debit" && ESSENTIAL_CATEGORIES.includes(t.category)) {
        expensesByMonth[monthKey] = (expensesByMonth[monthKey] || 0) + t.value;
      }

      if (t.type === "credit" && t.date.startsWith(currentMonthPrefix)) {
        totalIncomeCalc += t.value;
      }
    });

    const months = Object.keys(expensesByMonth);
    const numberOfMonths = months.length || 1;
    const totalEssentialExpenses = Object.values(expensesByMonth).reduce(
      (a, b) => a + b,
      0,
    );
    const averageEssentialCost = totalEssentialExpenses / numberOfMonths;

    return {
      costOfLiving: averageEssentialCost,
      emergencyFund: averageEssentialCost * 6, // 6 meses da média
      totalIncome: totalIncomeCalc,
    };
  }, [transactions]);

  // 2. Separação Inteligente das Metas
  const { budgets, lifeGoals } = useMemo(() => {
    const expenseNames = expenseCategories.map((c) => c.name);

    return {
      budgets: goals.filter(
        (g) =>
          g.type === "expense" ||
          (!g.type && expenseNames.includes(g.category)),
      ),
      lifeGoals: goals.filter(
        (g) =>
          g.type === "life" || (!g.type && !expenseNames.includes(g.category)),
      ),
    };
  }, [goals]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return {
    costOfLiving,
    emergencyFund,
    totalIncome,
    budgets,
    lifeGoals,
    formatCurrency,
  };
}
