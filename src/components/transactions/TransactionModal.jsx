import React, { useState, useCallback, useEffect } from "react";
import TextInput from "../common/TextInput";
import MoneyInput from "../common/MoneyInput";
import ActionButtons from "../common/ActionButtons";
import CategoryDropdown from "../category/CategoryDropdown";
import { expenseCategories, incomeCategories } from "../category/CategoryList";

// 🧠 O Cérebro da Classificação Automática
const keywordDictionary = {
  Alimentação: [
    "mercado",
    "padaria",
    "ifood",
    "pizza",
    "hamburguer",
    "restaurante",
    "lanche",
    "supermercado",
    "comida",
    "açougue",
  ],
  Moradia: [
    "aluguel",
    "luz",
    "água",
    "condomínio",
    "internet",
    "energia",
    "gás",
    "iptu",
  ],
  Transporte: [
    "uber",
    "gasolina",
    "posto",
    "ônibus",
    "metro",
    "pedágio",
    "estacionamento",
    "99",
    "combustível",
  ],
  Saúde: [
    "farmácia",
    "remédio",
    "médico",
    "consulta",
    "dentista",
    "hospital",
    "exame",
  ],
  Lazer: [
    "cinema",
    "netflix",
    "spotify",
    "show",
    "ingresso",
    "viagem",
    "bar",
    "festa",
    "jogo",
    "steam",
  ],
  Educação: [
    "curso",
    "faculdade",
    "livro",
    "escola",
    "mensalidade",
    "material",
  ],
  // Para Entradas (Créditos)
  Salário: ["salário", "pagamento", "adiantamento", "holerite"],
  Investimentos: ["rendimento", "dividendos", "tesouro", "selic", "fii"],
};

function TransactionModal({ type, onClose, onSave, initialData }) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState("");

  const categories = type === "credit" ? incomeCategories : expenseCategories;
  const isEditing = !!(initialData && initialData.id);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || "");
      setValue(
        initialData.value ? Math.round(initialData.value * 100).toString() : "",
      );
      setDate(initialData.date || "");
      setSelectedCategory(initialData.category || "");
      setIsFixed(initialData.isFixed || false);
    }
  }, [initialData]);

  // 👀 Observador: Verifica a descrição digitada para auto-categorizar
  useEffect(() => {
    // Só tenta adivinhar se NÃO estivermos editando uma transação antiga
    // e se o usuário ainda não escolheu uma categoria manualmente
    if (!isEditing && description.length > 2 && !selectedCategory) {
      const lowerDesc = description.toLowerCase();

      // Procura no dicionário
      for (const [categoryName, keywords] of Object.entries(
        keywordDictionary,
      )) {
        // Se alguma palavra-chave estiver contida no que o utilizador digitou
        if (keywords.some((kw) => lowerDesc.includes(kw))) {
          // Verifica se essa categoria pertence ao tipo atual (credit/debit)
          const isValidForType = categories.some(
            (c) => c.name === categoryName,
          );
          if (isValidForType) {
            setSelectedCategory(categoryName);
            break; // Para de procurar assim que encontrar
          }
        }
      }
    }
  }, [description, isEditing, categories, selectedCategory]);

  const validateForm = useCallback(() => {
    if (!description || !value || !date || !selectedCategory) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    setError("");
    return true;
  }, [description, value, date, selectedCategory]);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (validateForm()) {
        const numericValue = parseFloat(value) / 100;
        onSave({
          id: initialData?.id,
          type,
          description,
          value: numericValue,
          date,
          category: selectedCategory,
          isFixed,
        });
        onClose();
      }
    },
    [
      validateForm,
      onSave,
      type,
      description,
      value,
      date,
      selectedCategory,
      isFixed,
      initialData,
      onClose,
    ],
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
          {isEditing
            ? "Editar Transação"
            : type === "credit"
              ? "Adicionar Receita"
              : "Adicionar Despesa"}
        </h3>

        <form onSubmit={handleSave}>
          <TextInput
            label="Descrição *"
            value={description}
            onChange={setDescription}
          />

          <CategoryDropdown
            label="Categoria *"
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <MoneyInput label="Valor *" value={value} onChange={setValue} />
          <TextInput
            label="Data *"
            value={date}
            onChange={setDate}
            type="date"
          />

          {!isEditing && (
            <div className="flex items-center gap-2 mb-4 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isFixed"
                checked={isFixed}
                onChange={(e) => setIsFixed(e.target.checked)}
                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="isFixed"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Transação Fixa (Repetir nos próximos 12 meses)
              </label>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>
          )}
          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}

export default React.memo(TransactionModal);
