import React, { useMemo, useCallback } from "react";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import ProgressBar from "./ProgressBar";
import { FaTrashAlt, FaClock, FaBullseye, FaRocket } from "react-icons/fa";

/**
 * Componente GoalCard (Versão Sonhos Vibrantes 🚀)
 * Mantendo as cores originais, apenas corrigindo a responsividade da barra.
 */
function GoalCard({ goal, onDelete }) {
  // 1. Lógica de Tipo e Cores (MANTIDA INTACTA)
  const type = useMemo(() => {
    if (goal.type) return goal.type;
    const isExpenseCat = expenseCategories.some(
      (c) => c.name === goal.category,
    );
    return isExpenseCat ? "expense" : "life";
  }, [goal]);

  const categoryDetails = useMemo(() => {
    const allCategories = [...expenseCategories, ...incomeCategories];
    return allCategories.find((cat) => cat.name === goal.category);
  }, [goal.category]);

  const isLongTermDream = useMemo(() => {
    if (type === "expense") return false;
    const start = new Date(goal.startDate);
    const end = new Date(goal.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 180;
  }, [type, goal.startDate, goal.endDate]);

  const cardStyle = useMemo(() => {
    const baseStyle =
      "p-4 md:p-6 rounded-2xl shadow-xl transition-all duration-300 ease-in-out text-white relative overflow-hidden flex flex-col justify-between border-t-2 border-white border-opacity-20";

    const typeColors = {
      expense:
        "bg-gradient-to-br from-red-700 via-orange-600 to-red-900 shadow-red-900/30",
      lifeShort:
        "bg-gradient-to-br from-emerald-700 via-green-500 to-teal-800 shadow-green-900/30",
      lifeLong:
        "bg-gradient-to-tl from-indigo-900 via-purple-800 to-blue-700 shadow-indigo-900/30",
    };

    let colorKey = type;
    if (type === "life" || type === "income") {
      colorKey = isLongTermDream ? "lifeLong" : "lifeShort";
    }

    const finalColor =
      typeColors[colorKey] || typeColors[type] || "bg-gray-500";
    return `${baseStyle} ${finalColor}`;
  }, [type, isLongTermDream]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString + "T00:00:00");
    return d.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
  }, []);

  const goalInsights = useMemo(() => {
    if (
      (type !== "income" && type !== "life") ||
      goal.currentValue >= goal.goalValue
    )
      return null;
    const today = new Date();
    const start = new Date(goal.startDate + "T00:00:00");
    const end = new Date(goal.endDate + "T00:00:00");
    const getMonthsDiff = (d1, d2) => {
      let months = (d2.getFullYear() - d1.getFullYear()) * 12;
      months -= d1.getMonth();
      months += d2.getMonth();
      return months <= 0 ? 1 : months;
    };
    const remainingValue = goal.goalValue - goal.currentValue;
    const monthsLeft = getMonthsDiff(today, end);
    const requiredPerMonth = remainingValue / monthsLeft;
    const elapsedMonths = getMonthsDiff(start, today);
    const averageSavedPerMonth = goal.currentValue / elapsedMonths;
    let estimatedMonthsToFinish = Infinity;
    if (averageSavedPerMonth > 0) {
      estimatedMonthsToFinish = Math.ceil(
        remainingValue / averageSavedPerMonth,
      );
    }
    return { requiredPerMonth, estimatedMonthsToFinish, averageSavedPerMonth };
  }, [goal, type]);

  const DreamIcon = isLongTermDream ? FaRocket : FaBullseye;
  const displayIcon = categoryDetails?.icon || (
    <DreamIcon className="text-white text-xl" />
  );

  return (
    <div className={cardStyle} style={{ minHeight: "340px" }}>
      {/* Efeito de Brilho no Fundo */}
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 bg-no-repeat bg-cover mix-blend-overlay pointer-events-none filter blur-3xl transform scale-150 animate-pulse-slow"></div>

      <div className="relative z-10 flex-grow flex flex-col h-full">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 w-full overflow-hidden">
            <div
              className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-2xl p-3 shadow-lg backdrop-blur-md border border-white border-opacity-30 ${type === "expense" ? "bg-red-900 bg-opacity-40 text-red-100" : isLongTermDream ? "bg-indigo-900 bg-opacity-40 text-indigo-100" : "bg-green-900 bg-opacity-40 text-green-100"}`}
            >
              {displayIcon}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider opacity-80 font-bold truncate">
                {type === "expense"
                  ? "Orçamento"
                  : isLongTermDream
                    ? "Grande Sonho"
                    : "Objetivo"}
              </p>
              <h3 className="text-lg font-bold tracking-tight truncate leading-tight">
                {goal.category}
              </h3>
            </div>
          </div>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-white opacity-60 hover:opacity-100 hover:text-red-300 transition-all bg-black bg-opacity-20 rounded-full hover:bg-opacity-40 flex-shrink-0"
          >
            <FaTrashAlt />
          </button>
        </div>

        {/* Valores Principais - CORREÇÃO DE QUEBRA E ESPAÇO */}
        <div className="flex flex-col gap-1 mb-4 mt-auto">
          <p className="text-xs opacity-80 uppercase tracking-wider">
            {type === "expense" ? "Disponível" : "Alvo"}
          </p>
          {/* Flex-wrap permite que o /total caia para baixo se o valor for gigante */}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight break-all">
              {goal.goalValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p className="text-sm opacity-80 font-medium whitespace-nowrap">
              / total
            </p>
          </div>
        </div>

        {/* Barra Visual - PROTEGIDA para não sumir */}
        <div className="w-full flex-shrink-0">
          <ProgressBar
            type={type}
            currentValue={goal.currentValue}
            goalValue={goal.goalValue}
            isDream={isLongTermDream}
          />
        </div>

        <div className="flex justify-between items-center mt-3 text-xs font-medium opacity-90 bg-black bg-opacity-20 p-2 rounded-lg md:rounded-full">
          <span className="flex items-center gap-1">
            <FaClock opacity={0.7} /> Início: {formatDate(goal.startDate)}
          </span>
          <span>Fim: {formatDate(goal.endDate)}</span>
        </div>
      </div>

      {/* PAINEL DE INTELIGÊNCIA */}
      {goalInsights && (
        <div className="relative z-10 mt-4 bg-black bg-opacity-30 rounded-xl p-4 backdrop-blur-md border border-white border-opacity-10 shadow-inner">
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`mt-1 p-1.5 rounded-full ${isLongTermDream ? "bg-indigo-500" : "bg-green-500"} bg-opacity-30 flex-shrink-0`}
            >
              <DreamIcon
                className={
                  isLongTermDream ? "text-indigo-200" : "text-green-200"
                }
                size={14}
              />
            </div>
            <p className="text-sm leading-snug font-medium">
              Para realizar até <strong>{formatDate(goal.endDate)}</strong>,
              você precisa guardar{" "}
              <strong
                className={
                  isLongTermDream ? "text-indigo-300" : "text-green-300"
                }
              >
                {goalInsights.requiredPerMonth.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
                /mês
              </strong>
              .
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-full bg-blue-500 bg-opacity-30 flex-shrink-0">
              <FaClock className="text-blue-200" size={14} />
            </div>
            <p className="text-sm leading-snug font-medium opacity-90">
              {goalInsights.averageSavedPerMonth > 0 ? (
                <span>
                  No seu ritmo atual, o sonho se realiza em{" "}
                  <strong>{goalInsights.estimatedMonthsToFinish} meses</strong>.
                </span>
              ) : (
                <span>Comece a guardar para ver a previsão!</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(GoalCard);
