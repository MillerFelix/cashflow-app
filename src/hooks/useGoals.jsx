import { useState, useCallback } from "react";
import {
  db,
  addDoc,
  collection,
  query,
  getDocs,
  doc,
  deleteDoc,
  where,
} from "../firebase";
import { useAuth } from "../hooks/useAuth";

function useGoals() {
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
      const q = query(collection(db, "users", userId, "goals"));
      const querySnapshot = await getDocs(q);
      const goalsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsList);
    } catch (error) {
      console.error("Erro ao buscar metas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  function toggleModal() {
    setIsModalOpen((prevState) => !prevState);
    if (!isModalOpen) resetNewGoal();
  }

  function resetNewGoal() {
    setNewGoal({ category: "", goal: "", startDate: "", endDate: "" });
    setSuccessMessage("");
  }

  function handleGoalChange(value, field) {
    setNewGoal((prevState) => ({ ...prevState, [field]: value }));
  }

  async function addGoal() {
    if (!userId) return;
    setIsLoading(true);
    const parsedGoalValue = parseFloat(newGoal.goal) / 100;

    try {
      // 1. Buscar transações relacionadas à categoria da meta
      const transactionsRef = collection(db, "users", userId, "transactions");
      const q = query(
        transactionsRef,
        where("category", "==", newGoal.category)
      );
      const querySnapshot = await getDocs(q);

      // 2. Filtrar transações dentro do período da meta
      const startDate = new Date(newGoal.startDate);
      const endDate = new Date(newGoal.endDate);
      const filteredTransactions = querySnapshot.docs.filter((doc) => {
        const transaction = doc.data();
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      // 3. Calcular currentValue e achievement
      const currentValue = filteredTransactions.reduce(
        (sum, t) => sum + t.data().value,
        0
      );
      const achievement = (currentValue / parsedGoalValue) * 100;

      // 4. Salvar a meta com os valores calculados
      await addDoc(collection(db, "users", userId, "goals"), {
        goalValue: parsedGoalValue,
        achievement: achievement > 100 ? 100 : achievement,
        currentValue,
        category: newGoal.category,
        startDate: newGoal.startDate,
        endDate: newGoal.endDate,
      });

      toggleModal();
      setSuccessMessage("Meta salva com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Atualizar lista de metas
      fetchGoals();
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteGoal(goalId) {
    if (!userId) return;
    setIsLoading(true);
    try {
      const goalRef = doc(db, "users", userId, "goals", goalId);
      await deleteDoc(goalRef);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      setSuccessMessage("Meta removida com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao remover meta:", error);
    } finally {
      setIsLoading(false);
    }
  }

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
  };
}

export default useGoals;
