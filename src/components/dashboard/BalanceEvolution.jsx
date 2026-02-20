import React, { useMemo } from "react";
import { FaChartBar } from "react-icons/fa";

/**
 * Componente BalanceEvolution
 * Mostra a evolução das Receitas vs Despesas nos últimos meses.
 */
function BalanceEvolution({ transactions }) {
  const chartData = useMemo(() => {
    // Cria um objeto para agrupar as transações por Ano-Mês
    const monthlyData = {};

    transactions.forEach((t) => {
      // Pega apenas "YYYY-MM" da data (ex: "2026-05-12" -> "2026-05")
      const monthKey = t.date.substring(0, 7);

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0, label: monthKey };
      }

      if (t.type === "credit") monthlyData[monthKey].income += t.value;
      if (t.type === "debit") monthlyData[monthKey].expense += t.value;
    });

    // Converte para array, ordena cronologicamente e apanha os últimos 6 meses
    let sortedMonths = Object.values(monthlyData)
      .sort((a, b) => (a.label > b.label ? 1 : -1))
      .slice(-6);

    // Formata o rótulo para algo amigável (ex: "Mai", "Jun")
    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    // Descobre o maior valor (receita ou despesa) para escalar o gráfico dinamicamente
    let maxValue = 1;

    sortedMonths = sortedMonths.map((data) => {
      const [yearStr, monthStr] = data.label.split("-");
      const monthIndex = parseInt(monthStr, 10) - 1;

      if (data.income > maxValue) maxValue = data.income;
      if (data.expense > maxValue) maxValue = data.expense;

      return {
        ...data,
        shortLabel: monthNames[monthIndex],
      };
    });

    return { months: sortedMonths, maxValue };
  }, [transactions]);

  if (chartData.months.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full transition-transform hover:scale-[1.01] flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 border-b pb-2">
        <FaChartBar className="text-blue-500 text-xl" />
        <h3 className="text-gray-800 text-lg font-bold">Evolução Mensal</h3>
      </div>

      {/* Container do Gráfico */}
      <div className="flex flex-grow items-end justify-between gap-2 h-48 mt-4">
        {chartData.months.map((data, index) => {
          // Calcula a altura em percentagem (máximo 100%)
          const incomeHeight = (data.income / chartData.maxValue) * 100;
          const expenseHeight = (data.expense / chartData.maxValue) * 100;

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 group relative"
            >
              {/* Tooltip escondido que aparece no hover */}
              <div className="absolute -top-12 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                <span className="text-green-400">
                  +
                  {data.income.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
                <br />
                <span className="text-red-400">
                  -
                  {data.expense.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>

              {/* Barras Lado a Lado */}
              <div className="flex items-end gap-1 w-full h-full justify-center">
                {/* Barra de Receita */}
                <div
                  className="bg-green-500 rounded-t-sm w-1/3 max-w-[12px] min-h-[4px] transition-all duration-1000"
                  style={{ height: `${incomeHeight}%` }}
                ></div>
                {/* Barra de Despesa */}
                <div
                  className="bg-red-500 rounded-t-sm w-1/3 max-w-[12px] min-h-[4px] transition-all duration-1000"
                  style={{ height: `${expenseHeight}%` }}
                ></div>
              </div>

              <span className="text-xs text-gray-500 mt-2 font-medium">
                {data.shortLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Receitas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Despesas</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(BalanceEvolution);
