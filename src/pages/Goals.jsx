import React, { useState, useEffect } from "react";
import Button from "../components/common/Button";
import GoalsModal from "../components/goals/GoalsModal";
import useGoals from "../hooks/useGoals";

function Goals() {
  const {
    goals,
    fetchGoals,
    addGoal,
    isModalOpen,
    toggleModal,
    newGoal,
    handleGoalChange,
    successMessage,
  } = useGoals();

  function getProgressBarColor(category) {
    return category === "Ganho" ? "bg-green-500" : "bg-red-500";
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Metas Financeiras</h1>
      <Button
        onClick={toggleModal}
        bgColor="bg-blue-500"
        hoverColor="hover:bg-blue-600"
        className="text-white mb-6"
      >
        Adicionar Meta
      </Button>
      {successMessage && (
        <div className="p-4 text-center rounded-lg my-4 bg-green-200 text-green-800">
          {successMessage}
        </div>
      )}
      <GoalsModal
        isOpen={isModalOpen}
        onClose={toggleModal}
        onSave={addGoal}
        newGoal={newGoal}
        handleGoalChange={handleGoalChange}
        existingGoals={goals}
      />
      {/* Dividir em componente próprio posteriormente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">{goal.category} - Meta</h3>
            <p>Objetivo: R${goal.goal}</p>
            <p>Progresso: R${goal.progress}</p>
            <div className="h-2 bg-gray-300 rounded-full mb-4">
              <div
                className={`h-full ${getProgressBarColor(
                  goal.category
                )} rounded-full`}
                style={{ width: `${(goal.progress / goal.goal) * 100}%` }}
              />
            </div>
            <p>
              {goal.startDate} - {goal.endDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Goals;
