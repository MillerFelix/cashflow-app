import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ConfirmationModal from "../components/common/ConfirmationModal";
import GoalsModal from "../components/goals/GoalsModal";
import useGoals from "../hooks/useGoals";
import GoalCard from "../components/goals/GoalCard";
import {
  expenseCategories,
  incomeCategories,
} from "../components/category/CategoryList";
import NoData from "../components/common/NoData";

function Goals() {
  const {
    goals,
    fetchGoals,
    addGoal,
    deleteGoal,
    isModalOpen,
    toggleModal,
    newGoal,
    handleGoalChange,
    successMessage,
    isLoading,
  } = useGoals();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  function handleDeleteClick(goalId) {
    setGoalToDelete(goalId);
    setShowDeleteModal(true);
  }

  function handleDeleteConfirm() {
    deleteGoal(goalToDelete);
    setShowDeleteModal(false);
  }

  function getGoalType(goal) {
    const allCategories = [...expenseCategories, ...incomeCategories];
    const category = allCategories.find((cat) => cat.name === goal.category);
    return category ? category.type : null;
  }

  const sortedGoals = goals.sort((a, b) => {
    const typeA = getGoalType(a);
    const typeB = getGoalType(b);
    if (typeA === "income" && typeB === "expense") return -1;
    if (typeA === "expense" && typeB === "income") return 1;
    return 0;
  });

  // Cálculo do resumo financeiro
  const totalExpenses = goals
    .filter((goal) => getGoalType(goal) === "expense")
    .reduce((sum, goal) => sum + goal.currentValue, 0);

  const limitExpenses = goals
    .filter((goal) => getGoalType(goal) === "expense")
    .reduce((sum, goal) => sum + goal.goalValue, 0);

  const totalIncome = goals
    .filter((goal) => getGoalType(goal) === "income")
    .reduce((sum, goal) => sum + goal.currentValue, 0);

  const plannedIncome = goals
    .filter((goal) => getGoalType(goal) === "income")
    .reduce((sum, goal) => sum + goal.goalValue, 0);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen relative">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Metas Financeiras
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas metas e alcance seus objetivos financeiros.
          </p>
          <Button
            onClick={toggleModal}
            bgColor="bg-blue-600"
            hoverColor="hover:bg-blue-800"
            className="text-white text-lg px-6 py-3 rounded-lg shadow-lg mt-4"
          >
            Criar Meta
          </Button>
        </div>

        {/* Resumo financeiro */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Resumo das Metas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
            <div className="bg-red-100 p-4 rounded-lg shadow-md text-center">
              <p className="text-red-600 font-bold text-lg">Gastos</p>
              <p className="text-gray-900 text-xl font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalExpenses)}
              </p>
              <p className="text-gray-600">
                Limite:{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(limitExpenses)}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-md text-center">
              <p className="text-green-600 font-bold text-lg">Ganhos</p>
              <p className="text-gray-900 text-xl font-semibold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalIncome)}
              </p>
              <p className="text-gray-600">
                Planejado:{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(plannedIncome)}
              </p>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 text-center rounded-lg mb-6 bg-green-200 text-green-800 shadow-md">
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

        {isLoading ? (
          <Loader />
        ) : goals.length === 0 ? (
          <NoData message="Nenhuma meta cadastrada. Adicione uma para começar!" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        showModal={showDeleteModal}
        title="Confirmar Exclusão"
        description="Tem certeza de que deseja remover esta meta?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default Goals;
