import React from "react";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import ProgressBar from "./ProgressBar";
import { FaTrashAlt } from "react-icons/fa";

function GoalCard({ goal, onDelete }) {
  function getCategoryDetails(categoryName) {
    const allCategories = [...expenseCategories, ...incomeCategories];
    return allCategories.find((cat) => cat.name === categoryName);
  }

  const categoryDetails = getCategoryDetails(goal.category);

  function getCardStyle(type) {
    const baseStyle =
      "p-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out text-white relative overflow-hidden";
    const typeColors = {
      expense: "bg-gradient-to-br from-red-600 via-orange-600 to-red-800",
      income: "bg-gradient-to-br from-emerald-800 via-lime-500 to-green-800",
    };

    return `${baseStyle} ${typeColors[type] || "bg-gray-500"}`;
  }

  function formatDate(date) {
    const d = new Date(date + "T00:00:00");
    return d.toLocaleDateString("pt-BR");
  }

  const achievementPercentage = (goal.currentValue / goal.goalValue) * 100;

  return (
    <div className={`${getCardStyle(categoryDetails?.type)}`}>
      <div className="absolute inset-0 opacity-10 bg-white rounded-xl blur-xl"></div>

      <div className="relative z-10">
        <div className="flex items-center mb-4">
          {categoryDetails?.icon && (
            <div className="w-12 h-12 mr-4 text-2xl flex items-center justify-center bg-yellow-400 bg-opacity-60 rounded-full p-2 shadow-md">
              {categoryDetails.icon}
            </div>
          )}
          <h3 className="text-lg font-semibold tracking-wide uppercase">
            {goal.category}
          </h3>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 absolute top-2 right-2 text-yellow-300 hover:text-yellow-400 transition-transform duration-200 active:scale-95 hover:scale-105"
          >
            <FaTrashAlt />
          </button>
        </div>
        <p className="mb-2 text-sm">
          <strong>
            {categoryDetails?.type === "expense" ? "Limite" : "Meta"}:
          </strong>{" "}
          R${goal.goalValue.toFixed(2)}
        </p>
        <p className="mb-2 text-sm">
          <strong>Atual:</strong> R${goal.currentValue.toFixed(2)}
        </p>
        <ProgressBar
          type={categoryDetails?.type}
          currentValue={goal.currentValue}
          goalValue={goal.goalValue}
        />
        <p className="text-sm">
          <strong>Período:</strong> {formatDate(goal.startDate)} -{" "}
          {formatDate(goal.endDate)}
        </p>
        <p className="text-sm mt-2">
          <strong>
            {categoryDetails?.type === "expense" ? "Utilizado" : "Progresso"}:
          </strong>{" "}
          {`${Math.round(achievementPercentage)}%`}
        </p>
      </div>
    </div>
  );
}

export default GoalCard;
