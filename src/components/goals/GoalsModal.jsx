import { useState } from "react";
import TextInput from "../common/TextInput";
import MoneyInput from "../common/MoneyInput";
import ActionButtons from "../common/ActionButtons";
import Dropdown from "../category/Dropdown"; // Importando o Dropdown
import { expenseCategories, incomeCategories } from "../category/CategoryList";

function GoalsModal({ isOpen, onClose, onSave, newGoal, handleGoalChange }) {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isOpen) return null;

  const categories = [...incomeCategories, ...expenseCategories];

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Criar Meta</h2>

        {/* Dropdown substituindo o campo de categoria */}
        <Dropdown
          label="Categoria"
          categories={categories}
          selectedCategory={newGoal.category} // Passando a categoria selecionada
          onSelect={(category) => handleGoalChange(category.name, "category")}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
        />

        <MoneyInput
          label="Valor Alvo"
          value={newGoal.goal}
          onChange={(e) => handleGoalChange(e, "goal")}
          error={""}
        />

        <TextInput
          label="Data de Início"
          value={newGoal.startDate}
          onChange={(e) => handleGoalChange(e, "startDate")}
          type="date"
        />

        <TextInput
          label="Data de Fim"
          value={newGoal.endDate}
          onChange={(e) => handleGoalChange(e, "endDate")}
          type="date"
        />

        <ActionButtons onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
}

export default GoalsModal;
