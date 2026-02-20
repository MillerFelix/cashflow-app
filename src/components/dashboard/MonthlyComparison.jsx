import React, { useMemo } from "react";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

/**
 * Componente MonthlyComparison
 * Calcula e exibe a diferença percentual de ganhos e gastos
 * do mês atual em comparação com o mês anterior.
 */
function MonthlyComparison({ transactions }) {
  const comparisonData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Lógica para descobrir qual foi o mês passado (cuidando da virada de ano)
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentIncome = 0,
      currentExpense = 0;
    let prevIncome = 0,
      prevExpense = 0;

    transactions.forEach((t) => {
      // t.date vem no formato "YYYY-MM-DD"
      const [yearStr, monthStr] = t.date.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1; // Meses no JS vão de 0 a 11

      if (year === currentYear && month === currentMonth) {
        if (t.type === "credit") currentIncome += t.value;
        else if (t.type === "debit") currentExpense += t.value;
      } else if (year === prevYear && month === prevMonth) {
        if (t.type === "credit") prevIncome += t.value;
        else if (t.type === "debit") prevExpense += t.value;
      }
    });

    // Calcula a porcentagem de diferença
    const calcPercentage = (current, prev) => {
      if (prev === 0) return current > 0 ? 100 : 0; // Se não tinha nada antes, cresceu 100%
      return ((current - prev) / prev) * 100;
    };

    return {
      incomePerc: calcPercentage(currentIncome, prevIncome),
      expensePerc: calcPercentage(currentExpense, prevExpense),
      hasData:
        currentIncome > 0 ||
        currentExpense > 0 ||
        prevIncome > 0 ||
        prevExpense > 0,
    };
  }, [transactions]);

  if (!comparisonData.hasData) return null; // Não exibe se não houver dados nos últimos 2 meses

  // Função auxiliar para renderizar a setinha e a cor baseada no tipo (Ganho/Gasto)
  const renderIndicator = (percentage, type) => {
    const isIncome = type === "income";
    const isPositive = percentage > 0;
    const isZero = percentage === 0;

    // Regra de cores:
    // Subir Ganho = Verde | Cair Ganho = Vermelho
    // Subir Gasto = Vermelho | Cair Gasto = Verde
    let colorClass = "text-gray-500";
    if (!isZero) {
      if (isIncome) {
        colorClass = isPositive ? "text-green-500" : "text-red-500";
      } else {
        colorClass = isPositive ? "text-red-500" : "text-green-500";
      }
    }

    return (
      <div className={`flex items-center gap-1 font-bold ${colorClass}`}>
        {isZero ? <FaMinus /> : isPositive ? <FaArrowUp /> : <FaArrowDown />}
        <span>{Math.abs(percentage).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full flex flex-col md:flex-row justify-between items-center gap-4 transition-transform hover:scale-[1.01]">
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
          Comparação Mensal
        </h3>
        <p className="text-gray-800 text-sm mt-1">
          Desempenho em relação ao mês anterior
        </p>
      </div>

      <div className="flex gap-6 w-full md:w-auto justify-around border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 font-medium mb-1">
            Receitas
          </span>
          {renderIndicator(comparisonData.incomePerc, "income")}
        </div>
        <div className="w-px bg-gray-200"></div> {/* Linha divisória */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400 font-medium mb-1">
            Despesas
          </span>
          {renderIndicator(comparisonData.expensePerc, "expense")}
        </div>
      </div>
    </div>
  );
}

export default React.memo(MonthlyComparison);
