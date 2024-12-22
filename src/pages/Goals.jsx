import React, { useState } from "react";
import GoalsModal from "../components/goals/GoalsModal";
import Button from "../components/common/Button";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    category: "",
    target: "",
    startDate: "",
    endDate: "",
  });

  const handleSaveGoal = () => {
    if (newGoal.category && newGoal.target) {
      setGoals([
        ...goals,
        {
          id: goals.length + 1,
          ...newGoal,
          spent: 0,
          target: parseFloat(newGoal.target),
        },
      ]);
      setNewGoal({ category: "", target: "", startDate: "", endDate: "" });
      setShowModal(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Metas do Mês</h1>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              {goal.category}
            </h2>
            <p className="text-sm text-gray-600">
              Meta: R${goal.target} - Gasto: R${goal.spent}
            </p>
            <p className="text-sm text-gray-600">
              De: {goal.startDate || "N/A"} até {goal.endDate || "N/A"}
            </p>
            <div className="relative h-4 bg-gray-200 rounded-full mt-2">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                style={{ width: `${(goal.spent / goal.target) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <Button
        label="Criar Meta"
        onClick={() => setShowModal(true)}
        className="mt-6 bg-green-700 text-white hover:bg-green-600"
      >
        Criar Meta
      </Button>

      <GoalsModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveGoal}
        newGoal={newGoal}
        setNewGoal={setNewGoal}
      />
    </div>
  );
}

export default Goals;
