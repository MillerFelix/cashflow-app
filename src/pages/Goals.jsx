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

  // Função para determinar se o goal é de 'income' ou 'expense'
  function getGoalType(goal) {
    const allCategories = [...expenseCategories, ...incomeCategories];
    const category = allCategories.find((cat) => cat.name === goal.category);
    return category ? category.type : null; // Retorna 'expense' ou 'income'
  }

  // Ordenando as metas: primeiro as de 'income' (ganho), depois as de 'expense' (gasto)
  const sortedGoals = goals.sort((a, b) => {
    const typeA = getGoalType(a);
    const typeB = getGoalType(b);
    if (typeA === "income" && typeB === "expense") {
      return -1;
    } else if (typeA === "expense" && typeB === "income") {
      return 1;
    }
    return 0;
  });

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-r from-gray-100 to-gray-300 min-h-screen relative">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
        Metas Financeiras
      </h1>
      <Button
        onClick={toggleModal}
        bgColor="bg-gradient-to-r from-blue-500 to-blue-700"
        hoverColor="hover:bg-blue-600"
        className="text-sm sm:text-base text-white mb-4 sm:mb-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-md"
      >
        Adicionar Meta
      </Button>
      {successMessage && (
        <div className="p-4 text-center rounded-lg my-4 bg-green-200 text-green-800 shadow-md">
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
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
            isModalOpen ? "pointer-events-none" : ""
          }`}
        >
          {sortedGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}
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
