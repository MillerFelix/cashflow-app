import React, { useState } from "react";
import Button from "../components/common/Button";
import GoalsModal from "../components/goals/GoalsModal";

const categories = ["Ganho", "Despesa"]; // Exemplo de categorias
const sampleGoals = [
  {
    id: 1,
    category: "Ganho",
    goal: 5000,
    progress: 2000,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
  },
  {
    id: 2,
    category: "Despesa",
    goal: 3000,
    progress: 1200,
    startDate: "2024-01-01",
    endDate: "2024-06-30",
  },
];

const Goals = () => {
  const [goals, setGoals] = useState(sampleGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: "",
    goal: "",
    startDate: "",
    endDate: "",
  });

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const handleGoalChange = (value, field) => {
    setNewGoal((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleAddGoal = () => {
    setGoals([...goals, { ...newGoal, id: goals.length + 1, progress: 0 }]);
    setIsModalOpen(false);
    setNewGoal({ category: "", goal: "", startDate: "", endDate: "" });
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
          <div
            key={goal.id}
            className={`bg-white p-4 rounded-lg shadow-lg ${getProgressBarColor(
              goal.category
            )}`}
          >
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
};

export default Goals;
