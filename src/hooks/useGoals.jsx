import { useState, useCallback } from "react";
import { GoalService } from "../services/goalService";
import { useAuth } from "../hooks/useAuth";

export function useGoals() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: "",
    goal: "",
    startDate: "",
    endDate: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const user = useAuth();
  const userId = user?.uid;

  const fetchGoals = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const goalsList = await GoalService.getAll(userId);
      setGoals(goalsList);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const resetNewGoal = useCallback(() => {
    setNewGoal({ category: "", goal: "", startDate: "", endDate: "" });
    setSuccessMessage("");
  }, []);

  const toggleModal = useCallback(() => {
    setIsModalOpen((prevState) => {
      const newState = !prevState;
      if (!newState) resetNewGoal();
      return newState;
    });
  }, [resetNewGoal]);

  const handleGoalChange = useCallback((value, field) => {
    setNewGoal((prevState) => ({ ...prevState, [field]: value }));
  }, []);

  const addGoal = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const parsedGoalValue = parseFloat(newGoal.goal) / 100;

    try {
      // 1. Busca as transações usando a Service
      const transactions = await GoalService.getTransactionsByCategory(
        userId,
        newGoal.category,
      );

      // 2. Filtra pelas datas para calcular o valor inicial
      const startDate = new Date(newGoal.startDate + "T00:00:00");
      const endDate = new Date(newGoal.endDate + "T00:00:00");

      const currentValue = transactions.reduce((sum, t) => {
        const tDate = new Date(t.date + "T00:00:00");
        if (tDate >= startDate && tDate <= endDate) {
          return sum + t.value;
        }
        return sum;
      }, 0);

      const achievement = (currentValue / parsedGoalValue) * 100;

      // 3. Salva a meta usando a Service
      await GoalService.add(userId, {
        goalValue: parsedGoalValue,
        achievement: Math.min(achievement, 100),
        currentValue,
        category: newGoal.category,
        startDate: newGoal.startDate,
        endDate: newGoal.endDate,
      });

      toggleModal();
      setSuccessMessage("Meta salva com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);

      fetchGoals();
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, newGoal, toggleModal, fetchGoals]);

  const deleteGoal = useCallback(
    async (goalId) => {
      if (!userId) return;
      setIsLoading(true);
      try {
        await GoalService.remove(userId, goalId);
        setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
        setSuccessMessage("Meta removida com sucesso!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Erro ao remover meta:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  // Esta função é chamada pelo useTransactions!
  // Ela descobre se a transação nova afeta alguma meta existente e atualiza o progresso.
  const updateGoalsAchievement = useCallback(
    async (uid, category, value, date) => {
      try {
        const allGoals = await GoalService.getAll(uid);
        const transactionDate = new Date(date + "T00:00:00");

        for (const goal of allGoals) {
          if (goal.category === category) {
            const startDate = new Date(goal.startDate + "T00:00:00");
            const endDate = new Date(goal.endDate + "T00:00:00");

            // Se a transação estiver dentro do período da meta, atualiza a meta!
            if (transactionDate >= startDate && transactionDate <= endDate) {
              const newCurrentValue = goal.currentValue + value;
              const newAchievement = Math.min(
                (newCurrentValue / goal.goalValue) * 100,
                100,
              );

              // Atualiza no banco usando a Service
              await GoalService.update(uid, goal.id, {
                currentValue: newCurrentValue,
                achievement: newAchievement,
              });
            }
          }
        }
      } catch (error) {
        console.error(
          "Erro ao atualizar progresso da meta em background:",
          error,
        );
      }
    },
    [],
  );

  return {
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
    updateGoalsAchievement, // Exportamos para o useTransactions poder usar
  };
}

export default useGoals;
