import React, { useMemo } from "react";
import { FaTrophy, FaExclamationCircle } from "react-icons/fa";

/**
 * Componente TopExpensesRanking
 * Analisa as transações e cria um Ranking das 5 categorias que mais consumiram dinheiro.
 */
function TopExpensesRanking({ transactions }) {
  const rankingData = useMemo(() => {
    // 1. Filtra apenas as despesas (debits)
    const expenses = transactions.filter((t) => t.type === "debit");

    if (expenses.length === 0) return [];

    // 2. Agrupa por categoria e soma os valores
    const expensesByCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.value;
      return acc;
    }, {});

    // 3. Transforma num array, ordena do maior para o menor gasto e apanha os Top 5
    const sortedRanking = Object.entries(expensesByCategory)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Calcula o total destas top 5 para fazer a proporção visual das barras
    const maxExpense = sortedRanking[0]?.value || 1;

    return sortedRanking.map((item) => ({
      ...item,
      percentageOfMax: (item.value / maxExpense) * 100,
    }));
  }, [transactions]);

  if (rankingData.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full transition-transform hover:scale-[1.01] flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 border-b pb-2">
        <FaExclamationCircle className="text-red-500 text-xl" />
        <h3 className="text-gray-800 text-lg font-bold">
          Maiores Despesas (Top 5)
        </h3>
      </div>

      <div className="flex flex-col gap-4 flex-grow justify-center">
        {rankingData.map((item, index) => (
          <div key={item.category} className="flex flex-col">
            <div className="flex justify-between items-end mb-1">
              <span className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <span className="text-gray-400 font-bold">#{index + 1}</span>
                {item.category}
              </span>
              <span className="text-red-500 font-bold text-sm">
                {item.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
            {/* Barra Visual */}
            <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
              <div
                className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${item.percentageOfMax}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(TopExpensesRanking);
