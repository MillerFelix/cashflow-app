import React, { useMemo, useCallback } from "react";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import ProgressBar from "./ProgressBar";
import { FaTrashAlt, FaClock, FaBullseye } from "react-icons/fa";

/**
 * Componente GoalCard
 * Agora com Inteligência de Metas (Fase 3 do Roadmap):
 * Calcula o ritmo necessário e a previsão de conclusão automaticamente.
 */
function GoalCard({ goal, onDelete }) {
  const categoryDetails = useMemo(() => {
    const allCategories = [...expenseCategories, ...incomeCategories];
    return allCategories.find((cat) => cat.name === goal.category);
  }, [goal.category]);

  const type = categoryDetails?.type;

  const cardStyle = useMemo(() => {
    const baseStyle =
      "p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out text-white relative overflow-hidden flex flex-col justify-between";
    const typeColors = {
      expense: "bg-gradient-to-br from-red-600 via-orange-600 to-red-800",
      income: "bg-gradient-to-br from-emerald-800 via-lime-500 to-green-800",
    };
    return `${baseStyle} ${typeColors[type] || "bg-gray-500"}`;
  }, [type]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
  }, []);

  // ==========================================
  // 🧠 MOTOR DE INTELIGÊNCIA DA META (Passos 7 e 8)
  // ==========================================
  const goalInsights = useMemo(() => {
    // Só calculamos estes insights para metas de "Ganhos/Poupança" que ainda não foram batidas
    if (type !== "income" || goal.currentValue >= goal.goalValue) return null;

    const today = new Date();
    const start = new Date(goal.startDate + "T00:00:00");
    const end = new Date(goal.endDate + "T00:00:00");

    // Função que calcula a diferença de meses entre duas datas
    const getMonthsDiff = (d1, d2) => {
      let months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth();
      months += d2.getMonth();
      return months <= 0 ? 1 : months; // Evita divisão por zero (assume no mínimo 1 mês)
    };

    const remainingValue = goal.goalValue - goal.currentValue;

    // Passo 8: Simulador de Ritmo Necessário
    const monthsLeft = getMonthsDiff(today, end);
    const requiredPerMonth = remainingValue / monthsLeft;

    // Passo 7: Previsão de Conclusão de Meta
    const elapsedMonths = getMonthsDiff(start, today);
    const averageSavedPerMonth = goal.currentValue / elapsedMonths;

    let estimatedMonthsToFinish = Infinity;
    if (averageSavedPerMonth > 0) {
      estimatedMonthsToFinish = Math.ceil(
        remainingValue / averageSavedPerMonth,
      );
    }

    return {
      requiredPerMonth,
      monthsLeft,
      estimatedMonthsToFinish,
      averageSavedPerMonth,
    };
  }, [goal, type]);

  const achievementPercentage = (goal.currentValue / goal.goalValue) * 100;

  return (
    <div className={cardStyle} style={{ minHeight: "320px" }}>
      <div className="absolute inset-0 opacity-10 bg-white rounded-xl blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex-grow">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 md:gap-4 w-full">
            {categoryDetails?.icon && (
              <div className="w-10 h-10 md:w-12 md:h-12 text-xl flex items-center justify-center bg-yellow-400 bg-opacity-60 rounded-full p-2 shadow-md">
                {categoryDetails.icon}
              </div>
            )}
            <h3 className="text-sm md:text-lg font-semibold tracking-wide uppercase truncate w-full">
              {goal.category}
            </h3>
          </div>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1 md:p-2 text-yellow-300 hover:text-red-400 transition-transform duration-200 active:scale-95 hover:scale-110"
            title="Excluir meta"
          >
            <FaTrashAlt className="text-sm md:text-base" />
          </button>
        </div>

        {/* Valores Principais */}
        <div className="flex justify-between items-end mb-3 border-b border-white border-opacity-20 pb-2">
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wider">
              {type === "expense" ? "Orçamento Máximo" : "Objetivo"}
            </p>
            <p className="text-lg font-bold">
              {goal.goalValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80 uppercase tracking-wider">
              {type === "expense" ? "Já Gasto" : "Poupado"}
            </p>
            <p className="text-lg font-bold text-yellow-300">
              {goal.currentValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>

        {/* Barra Visual */}
        <ProgressBar
          type={type}
          currentValue={goal.currentValue}
          goalValue={goal.goalValue}
        />

        <p className="text-xs text-center mt-1 opacity-90">
          Prazo: {formatDate(goal.startDate)} até {formatDate(goal.endDate)}
        </p>
      </div>

      {/* 🔮 PAINEL DE INTELIGÊNCIA (Visível apenas para metas de poupança em andamento) */}
      {goalInsights && (
        <div className="relative z-10 mt-4 bg-black bg-opacity-20 rounded-lg p-3 backdrop-blur-sm border border-white border-opacity-10">
          {/* Ritmo Necessário */}
          <div className="flex items-start gap-2 mb-2">
            <FaBullseye className="text-yellow-400 mt-1 flex-shrink-0" />
            <p className="text-xs leading-tight">
              Para atingir até <strong>{formatDate(goal.endDate)}</strong>,
              guarde{" "}
              <strong className="text-yellow-300">
                {goalInsights.requiredPerMonth.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
                /mês
              </strong>
              .
            </p>
          </div>

          {/* Previsão de Conclusão */}
          <div className="flex items-start gap-2">
            <FaClock className="text-blue-300 mt-1 flex-shrink-0" />
            <p className="text-xs leading-tight">
              {goalInsights.averageSavedPerMonth > 0 ? (
                <span>
                  No seu ritmo atual, vai demorar mais{" "}
                  <strong>{goalInsights.estimatedMonthsToFinish} meses</strong>{" "}
                  para bater a meta.
                </span>
              ) : (
                <span className="opacity-80">
                  Comece a guardar dinheiro para ver a sua previsão de
                  conclusão!
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(GoalCard);
