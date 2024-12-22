import React from "react";
import TextInput from "../common/TextInput";
import ActionButtons from "../common/ActionButtons";

function GoalsModal({ showModal, onClose, onSave, newGoal, setNewGoal }) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Nova Meta</h2>
        <TextInput
          placeholder="Categoria"
          value={newGoal.category}
          onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
          className="mb-4"
        />
        <TextInput
          type="number"
          placeholder="Valor Limite (R$)"
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          className="mb-4"
        />
        <div className="flex space-x-4">
          <TextInput
            type="date"
            value={newGoal.startDate}
            onChange={(e) =>
              setNewGoal({ ...newGoal, startDate: e.target.value })
            }
            className="w-full mb-4"
          />
          <TextInput
            type="date"
            value={newGoal.endDate}
            onChange={(e) =>
              setNewGoal({ ...newGoal, endDate: e.target.value })
            }
            className="w-full mb-4"
          />
        </div>
        <ActionButtons onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
}

export default GoalsModal;
