import React, { useState } from "react";

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

      <button
        className="mt-6 px-4 py-2 bg-green-700 text-white rounded-md shadow hover:bg-green-600"
        onClick={() => setShowModal(true)}
      >
        Criar Meta
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Nova Meta</h2>
            <input
              type="text"
              placeholder="Categoria"
              className="w-full mb-4 p-2 border rounded"
              value={newGoal.category}
              onChange={(e) =>
                setNewGoal({ ...newGoal, category: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Valor Limite (R$)"
              className="w-full mb-4 p-2 border rounded"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: e.target.value })
              }
            />
            <div className="flex space-x-4">
              <input
                type="date"
                className="w-full mb-4 p-2 border rounded"
                value={newGoal.startDate}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, startDate: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full mb-4 p-2 border rounded"
                value={newGoal.endDate}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, endDate: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-green-700 text-white rounded-md"
                onClick={handleSaveGoal}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
