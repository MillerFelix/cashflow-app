import React, { useMemo, useCallback } from "react";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import ProgressBar from "./ProgressBar";
import { FaTrashAlt } from "react-icons/fa";

/**
 * Componente GoalCard
 * Exibe as informações detalhadas de uma meta específica (Categoria, Valores, Datas e Progresso).
 */
function GoalCard({ goal, onDelete }) {
  // useMemo: Busca as informações visuais (ícone e tipo) da categoria.
  // Só refaz a busca se o nome da categoria da meta mudar.
  const categoryDetails = useMemo(() => {
    const allCategories = [...expenseCategories, ...incomeCategories];
    return allCategories.find((cat) => cat.name === goal.category);
  }, [goal.category]);

  const type = categoryDetails?.type;

  // useMemo: Calcula o estilo do cartão baseado no tipo (ganho ou despesa)
  const cardStyle = useMemo(() => {
    const baseStyle =
      "p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out text-white relative overflow-hidden";
    const typeColors = {
      expense: "bg-gradient-to-br from-red-600 via-orange-600 to-red-800",
      income: "bg-gradient-to-br from-emerald-800 via-lime-500 to-green-800",
    };
    return `${baseStyle} ${typeColors[type] || "bg-gray-500"}`;
  }, [type]);

  // useCallback: Formata a data garantindo que o fuso horário (T00:00:00) não altere o dia
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString + "T00:00:00");
    return d.toLocaleDateString("pt-BR");
  }, []);

  const achievementPercentage = (goal.currentValue / goal.goalValue) * 100;

  return (
    <div className={cardStyle}>
      <div className="absolute inset-0 opacity-10 bg-white rounded-xl blur-xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Cabeçalho do Card: Ícone, Nome da Categoria e Botão de Excluir */}
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

        {/* Informações Numéricas */}
        <p className="text-xs md:text-sm mb-1">
          <strong>{type === "expense" ? "Limite" : "Meta"}:</strong>{" "}
          {goal.goalValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <p className="text-xs md:text-sm mb-3">
          <strong>Atual:</strong>{" "}
          {goal.currentValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        {/* Barra Visual */}
        <ProgressBar
          type={type}
          currentValue={goal.currentValue}
          goalValue={goal.goalValue}
        />

        {/* Rodapé: Datas e Porcentagem */}
        <p className="text-xs md:text-sm mt-3">
          <strong>Período:</strong> {formatDate(goal.startDate)} -{" "}
          {formatDate(goal.endDate)}
        </p>
        <p className="text-xs md:text-sm mt-1">
          <strong>{type === "expense" ? "Utilizado" : "Progresso"}:</strong>{" "}
          {`${Math.round(achievementPercentage)}%`}
        </p>
      </div>
    </div>
  );
}

export default React.memo(GoalCard);
