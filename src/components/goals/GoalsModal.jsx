import { useState } from "react";
import TextInput from "../common/TextInput";
import MoneyInput from "../common/MoneyInput";
import ActionButtons from "../common/ActionButtons";
import Loader from "../common/Loader";
import StatusMessage from "../common/StatusMessage";
import { expenseCategories, incomeCategories } from "../category/CategoryList";

function GoalsModal({
  isOpen,
  onClose,
  onSave,
  newGoal,
  handleGoalChange,
  existingGoals,
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    newGoal.category || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.name);
    handleGoalChange(category.name, "category");
    setError(""); // Remove o erro ao selecionar nova categoria
  };

  const validateForm = () => {
    if (!newGoal.category) {
      setError("Por favor, selecione uma categoria.");
      return false;
    }
    if (existingGoals.some((goal) => goal.category === newGoal.category)) {
      setError("Já existe uma meta para essa categoria.");
      return false;
    }
    if (isNaN(newGoal.goal) || newGoal.goal <= 0) {
      setError("O valor da meta deve ser maior que zero.");
      return false;
    }
    if (!newGoal.startDate || !newGoal.endDate) {
      setError("As datas de início e fim devem ser preenchidas.");
      return false;
    }
    if (newGoal.startDate > newGoal.endDate) {
      setError("A data de início deve ser anterior à data de fim.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await onSave();
        setSuccessMessage("Meta salva com sucesso!");
        setTimeout(() => setSuccessMessage(""), 3000); // Apaga após 3 segundos
      } catch {
        setError("Erro ao salvar a meta.");
      } finally {
        setLoading(false);
      }
    }
  };

  const categories = [...incomeCategories, ...expenseCategories];

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Criar Meta
        </h2>

        {successMessage && <StatusMessage message={successMessage} />}
        {error && <StatusMessage message={`Erro: ${error}`} />}
        {loading && <Loader />}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Selecione a Categoria
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategorySelect(category)}
                className={`flex flex-col items-center p-3 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out 
                  ${
                    selectedCategory === category.name
                      ? category.type === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                      : category.type === "expense"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  } 
                  transform hover:scale-105`}
              >
                <div className="text-2xl">{category.icon}</div>
                <p className="mt-2 text-xs text-center">{category.name}</p>
              </div>
            ))}
          </div>
        </div>

        <MoneyInput
          label="Valor Alvo"
          value={newGoal.goal}
          onChange={(e) => handleGoalChange(e, "goal")}
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

        <ActionButtons
          onClose={() => {
            if (error) return; // Não fecha o modal se houver erro
            setSelectedCategory("");
            setError("");
            onClose();
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default GoalsModal;
