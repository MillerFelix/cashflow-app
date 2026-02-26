import React, { useState, useEffect } from "react";
import TextInput from "../common/TextInput";
import MoneyInput from "../common/MoneyInput";
import ActionButtons from "../common/ActionButtons";
import Loader from "../common/Loader";
import StatusMessage from "../common/StatusMessage";
import { expenseCategories } from "../category/CategoryList";
import { FaBullseye, FaChartPie, FaRocket } from "react-icons/fa";

function GoalsModal({
  isOpen,
  onClose,
  onSave,
  newGoal = {},
  handleGoalChange,
}) {
  const [goalType, setGoalType] = useState("expense");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (handleGoalChange) {
      handleGoalChange("", "category");
      handleGoalChange("", "customName");
      handleGoalChange(goalType, "type");
    }
    setError("");
  }, [goalType]);

  if (!isOpen) return null;

  const isExpense = goalType === "expense";

  const validateForm = () => {
    if (isExpense && !newGoal.category)
      return "Selecione uma categoria para o seu orçamento.";
    if (
      !isExpense &&
      (!newGoal.customName || newGoal.customName.trim().length < 3)
    )
      return "Dê um nome claro para o seu Objetivo (ex: Viagem).";
    if (!newGoal.goal || isNaN(newGoal.goal) || newGoal.goal <= 0)
      return "O valor definido deve ser maior que zero.";
    if (!newGoal.startDate || !newGoal.endDate)
      return "As datas de início e fim devem ser preenchidas.";
    if (newGoal.startDate > newGoal.endDate)
      return "A data de início deve ser anterior à data de fim.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      handleGoalChange(goalType, "type");
      await onSave();
      onClose();
    } catch {
      setError("Erro ao salvar o planejamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scaleIn">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Novo Planejamento
        </h2>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setGoalType("expense")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${isExpense ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <FaChartPie /> Orçamento (Freio)
          </button>
          <button
            type="button"
            onClick={() => setGoalType("life")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all ${!isExpense ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            <FaBullseye /> Objetivo de Vida
          </button>
        </div>

        {error && <StatusMessage message={error} type="error" />}
        {loading && (
          <div className="py-4 flex justify-center">
            <Loader />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
              1.{" "}
              {isExpense
                ? "Selecione a Categoria de Gasto"
                : "Qual é o seu Objetivo?"}
            </h3>

            {isExpense ? (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-200">
                {expenseCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      handleGoalChange(cat.name, "category");
                      setError("");
                    }}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${newGoal.category === cat.name ? "border-red-500 bg-red-50 text-red-700" : "border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"}`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <p className="text-[10px] font-bold text-center leading-tight uppercase">
                      {cat.name}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="text-3xl text-green-600 bg-white p-3 rounded-full shadow-sm">
                  <FaRocket />
                </div>
                <div className="w-full">
                  <TextInput
                    label="Nome do Objetivo"
                    value={newGoal.customName || ""}
                    onChange={(val) => handleGoalChange(val, "customName")}
                    placeholder="Ex: Viagem para o Japão..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 mb-8">
            <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
              2. Defina os Valores e Prazos
            </h3>
            <MoneyInput
              label={isExpense ? "Limite Máximo (R$)" : "Valor Necessário (R$)"}
              value={newGoal.goal || ""}
              onChange={(val) => handleGoalChange(val, "goal")}
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <TextInput
                label="Começa em"
                value={newGoal.startDate || ""}
                onChange={(val) => handleGoalChange(val, "startDate")}
                type="date"
              />
              <TextInput
                label="Termina em"
                value={newGoal.endDate || ""}
                onChange={(val) => handleGoalChange(val, "endDate")}
                type="date"
              />
            </div>
          </div>

          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}

export default React.memo(GoalsModal);
