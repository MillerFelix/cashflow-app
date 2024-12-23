import React, { useState, useEffect } from "react";
import Button from "../components/common/Button";
import GoalsModal from "../components/goals/GoalsModal";
import { db, addDoc, collection, query, getDocs } from "../firebase"; // Importando funções do Firebase
import { useAuth } from "../hooks/useAuth"; // Importando o hook useAuth

function Goals() {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: "",
    goal: "",
    startDate: "",
    endDate: "",
  });

  const userId = useAuth();

  const fetchGoals = async () => {
    if (userId) {
      const q = query(collection(db, "users", userId, "goals")); // Busca metas na subcoleção
      const querySnapshot = await getDocs(q);
      const goalsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(goalsList);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const handleGoalChange = (value, field) => {
    setNewGoal((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAddGoal = async () => {
    if (userId) {
      await addDoc(collection(db, "users", userId, "goals"), {
        ...newGoal,
        progress: 0,
      });
      setIsModalOpen(false);
      setNewGoal({ category: "", goal: "", startDate: "", endDate: "" });
      fetchGoals();
    }
  };

  const getProgressBarColor = (category) => {
    return category === "Ganho" ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Metas Financeiras</h1>
      <Button
        onClick={handleModalToggle}
        bgColor="bg-blue-500"
        hoverColor="hover:bg-blue-600"
        className="text-white mb-6"
      >
        Adicionar Meta
      </Button>
      <GoalsModal
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        onSave={handleAddGoal}
        newGoal={newGoal}
        handleGoalChange={handleGoalChange}
      />
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
