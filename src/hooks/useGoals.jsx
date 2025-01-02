import { useState, useCallback } from "react";
import {
  db,
  addDoc,
  collection,
  query,
  getDocs,
  doc,
  deleteDoc,
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
  const userId = useAuth();

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
    const parsedGoalValue = parseFloat(newGoal.goal) / 100;
    await addDoc(collection(db, "users", userId, "goals"), {
      goalValue: parsedGoalValue,
      achievement: 0,
      currentValue: 0,
      category: newGoal.category,
      startDate: newGoal.startDate,
      endDate: newGoal.endDate,
    });
    toggleModal();
    setSuccessMessage("Meta salva com sucesso!");
    setTimeout(() => setSuccessMessage(""), 3000);
    fetchGoals();
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
