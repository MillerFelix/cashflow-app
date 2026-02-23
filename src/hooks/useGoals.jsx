import { useState, useCallback, useEffect } from "react";
import { GoalService } from "../services/goalService";
import { useAuth } from "../hooks/useAuth";

export function useGoals() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: "",
    customName: "", // Garante que o nome livre exista no estado inicial
    type: "expense", // Garante que tenha um tipo inicial
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

  // 🔥 CORREÇÃO DO BUG 1: Faz as metas carregarem automaticamente assim que a tela abre
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const resetNewGoal = useCallback(() => {
    setNewGoal({
      category: "",
      customName: "",
      type: "expense",
      goal: "",
      startDate: "",
      endDate: "",
    });
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
      // Define o nome da categoria com base no tipo (Se for vida, usa o que o usuário digitou)
      const finalCategoryName =
        newGoal.type === "life" ? newGoal.customName : newGoal.category;

      const transactions = await GoalService.getTransactionsByCategory(
        userId,
        finalCategoryName,
      );

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

      // 🔥 CORREÇÃO DO BUG 2: Agora salva no Firebase exatamente o tipo e o nome personalizado!
      await GoalService.add(userId, {
        type: newGoal.type || "expense",
        goalValue: parsedGoalValue,
        achievement: Math.min(achievement, 100),
        currentValue,
        category: finalCategoryName,
        startDate: newGoal.startDate,
        endDate: newGoal.endDate,
      });

      toggleModal();
      setSuccessMessage("Planejamento salvo com sucesso!");
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
        setSuccessMessage("Planejamento removido com sucesso!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Erro ao remover meta:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  const updateGoalsAchievement = useCallback(
    async (uid, category, value, date) => {
      try {
        const allGoals = await GoalService.getAll(uid);
        const transactionDate = new Date(date + "T00:00:00");

        for (const goal of allGoals) {
          if (goal.category === category) {
            const startDate = new Date(goal.startDate + "T00:00:00");
            const endDate = new Date(goal.endDate + "T00:00:00");

            if (transactionDate >= startDate && transactionDate <= endDate) {
              const newCurrentValue = goal.currentValue + value;
              const newAchievement = Math.min(
                (newCurrentValue / goal.goalValue) * 100,
                100,
              );

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
    updateGoalsAchievement,
  };
}

export default useGoals;
