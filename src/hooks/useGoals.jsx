import { useState, useEffect } from "react";
import { db, addDoc, collection, query, getDocs } from "../firebase";
import { useAuth } from "../hooks/useAuth";

function useGoals() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: "",
    goal: "",
    startDate: "",
    endDate: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const userId = useAuth();

  async function fetchGoals() {
    if (userId) {
      const q = query(collection(db, "users", userId, "goals"));
      const querySnapshot = await getDocs(q);
      const goalsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsList);
    }
  }

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      resetNewGoal();
      setSuccessMessage("");
    }
  }

  function resetNewGoal() {
    setNewGoal({ category: "", goal: "", startDate: "", endDate: "" });
  }

  function handleGoalChange(value, field) {
    setNewGoal((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }

  async function addGoal() {
    if (userId) {
      const parsedGoalValue = parseFloat(newGoal.goal) / 100;
      await addDoc(collection(db, "users", userId, "goals"), {
        goalValue: parsedGoalValue,
        progress: 0,
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
  }

  return {
    goals,
    fetchGoals,
    addGoal,
    isModalOpen,
    toggleModal,
    newGoal,
    handleGoalChange,
    successMessage,
  };
}

export default useGoals;
