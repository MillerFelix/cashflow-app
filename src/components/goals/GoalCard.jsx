import React from "react";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import ProgressBar from "./ProgressBar";

function GoalCard({ goal }) {
  function getCategoryDetails(categoryName) {
    const allCategories = [...expenseCategories, ...incomeCategories];
    return allCategories.find((cat) => cat.name === categoryName);
  }

  const categoryDetails = getCategoryDetails(goal.category);

  function getCardStyle(type) {
    const baseStyle =
      "p-6 rounded-xl shadow-md transition-all duration-300 ease-in-out text-white";
    const typeColors = {
      expense: "bg-gradient-to-br from-red-400 via-red-500 to-red-600",
      income: "bg-gradient-to-br from-green-400 via-green-500 to-green-600",
    };

    return `${baseStyle} ${typeColors[type] || "bg-gray-500"}`;
  }

  function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const progressPercentage = (goal.currentValue / goal.goalValue) * 100;

  return (
    <div className={`${getCardStyle(categoryDetails?.type)} relative`}>
      <div className="flex items-center mb-4">
        {categoryDetails?.icon && (
          <div className="w-10 h-10 mr-4 text-2xl flex items-center justify-center bg-white bg-opacity-30 rounded-full p-2">
            {categoryDetails.icon}
          </div>
        )}
        <h3 className="text-lg font-semibold tracking-wide">{goal.category}</h3>
      </div>
      <p className="mb-2">
        <strong>
          {categoryDetails?.type === "expense" ? "Limite" : "Meta"}:
        </strong>{" "}
        R${goal.goalValue.toFixed(2)}
      </p>
      <p className="mb-2">
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
        <strong>Progresso:</strong> {`${Math.round(progressPercentage)}%`}
      </p>
    </div>
  );
}

export default GoalCard;
