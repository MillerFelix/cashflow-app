import React, { useEffect, useState, useMemo, useCallback } from "react";
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

/**
 * Página Goals (Metas)
 * Lista todas as metas do usuário e exibe um resumo comparativo de Ganhos x Gastos planejados.
 */
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

  const handleDeleteClick = useCallback((goalId) => {
    setGoalToDelete(goalId);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteGoal(goalToDelete);
    setShowDeleteModal(false);
  }, [deleteGoal, goalToDelete]);

  // Função auxiliar para descobrir se a categoria da meta é ganho ou despesa
  const getGoalType = useCallback((goal) => {
    const allCategories = [...expenseCategories, ...incomeCategories];
    const category = allCategories.find((cat) => cat.name === goal.category);
    return category ? category.type : null;
  }, []);

  // useMemo: Ordena as metas colocando as de ganho primeiro, depois as de despesa
  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => {
      const typeA = getGoalType(a);
      const typeB = getGoalType(b);
      if (typeA === "income" && typeB === "expense") return -1;
      if (typeA === "expense" && typeB === "income") return 1;
      return 0;
    });
  }, [goals, getGoalType]);

  // useMemo: Calcula o Resumo Financeiro (soma de todas as metas) apenas quando as metas mudam.
  const { totalExpenses, limitExpenses, totalIncome, plannedIncome } =
    useMemo(() => {
      let tExp = 0,
        lExp = 0,
        tInc = 0,
        pInc = 0;

      goals.forEach((goal) => {
        const type = getGoalType(goal);
        if (type === "expense") {
          tExp += goal.currentValue;
          lExp += goal.goalValue;
        } else if (type === "income") {
          tInc += goal.currentValue;
          pInc += goal.goalValue;
        }
      });

      return {
        totalExpenses: tExp,
        limitExpenses: lExp,
        totalIncome: tInc,
        plannedIncome: pInc,
      };
    }, [goals, getGoalType]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen relative">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        {/* Cabeçalho */}
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
            className="text-white text-lg px-6 py-3 rounded-lg shadow-lg mt-4 transition-transform hover:-translate-y-1"
          >
            Criar Meta
          </Button>
        </div>

        {/* Resumo Financeiro */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            Resumo das Metas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg shadow-sm text-center transition-shadow hover:shadow-md">
              <p className="text-red-600 font-bold text-lg uppercase tracking-wide">
                Gastos
              </p>
              <p className="text-gray-900 text-2xl font-bold my-1">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-gray-600 text-sm">
                Limite: {formatCurrency(limitExpenses)}
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 p-4 rounded-lg shadow-sm text-center transition-shadow hover:shadow-md">
              <p className="text-green-600 font-bold text-lg uppercase tracking-wide">
                Ganhos
              </p>
              <p className="text-gray-900 text-2xl font-bold my-1">
                {formatCurrency(totalIncome)}
              </p>
              <p className="text-gray-600 text-sm">
                Planejado: {formatCurrency(plannedIncome)}
              </p>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 text-center rounded-lg mb-6 bg-green-100 border border-green-200 text-green-800 shadow-sm animate-pulse">
            {successMessage}
          </div>
        )}

        {/* Modal de Criação */}
        <GoalsModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onSave={addGoal}
          newGoal={newGoal}
          handleGoalChange={handleGoalChange}
          existingGoals={goals}
        />

        {/* Listagem de Metas */}
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
        description="Tem certeza de que deseja remover esta meta permanentemente?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default Goals;
