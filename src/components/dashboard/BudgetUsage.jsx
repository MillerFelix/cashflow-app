import React, { useMemo } from "react";
import { expenseCategories } from "../category/CategoryList";

function BudgetUsage({ goals }) {
  const budgetList = useMemo(() => {
    const expenseNames = expenseCategories.map((c) => c.name);
    return goals.filter((g) => expenseNames.includes(g.category));
  }, [goals]);

  if (budgetList.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full transition-transform hover:scale-[1.01]">
      <h3 className="text-gray-800 text-lg font-bold mb-4 border-b pb-2">
        Uso do Orçamento Mensal
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetList.map((budget) => {
          const percentage = Math.min(
            (budget.currentValue / budget.goalValue) * 100,
            100,
          );

          // Lógica dos Alertas Visuais (Passo 15)
          const isDanger = percentage >= 85;
          const isWarning = percentage >= 60 && percentage < 85;

          let barColor = "bg-green-500";
          let statusLabel = "🟢 Seguro";

          if (isDanger) {
            barColor = "bg-red-500";
            statusLabel = "🔴 Estourado";
          } else if (isWarning) {
            barColor = "bg-yellow-400";
            statusLabel = "🟡 Atenção";
          }

          return (
            <div
              key={budget.id}
              className="flex flex-col bg-gray-50 p-3 rounded-lg border border-gray-100"
            >
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold text-gray-700 truncate mr-2">
                  {budget.category}
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-white shadow-sm border border-gray-200">
                  {statusLabel}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner mb-1">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs mt-1">
                <span className="text-gray-500">
                  {budget.currentValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}{" "}
                  gastos
                </span>
                <span className="font-bold text-gray-700">
                  Limite:{" "}
                  {budget.goalValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(BudgetUsage);
