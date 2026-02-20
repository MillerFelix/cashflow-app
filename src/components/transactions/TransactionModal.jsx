import React, { useState, useCallback, useEffect } from "react";
import TextInput from "../common/TextInput";
import MoneyInput from "../common/MoneyInput";
import ActionButtons from "../common/ActionButtons";
import CategoryDropdown from "../category/CategoryDropdown";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import { CategoryService } from "../../services/categoryService";
import { useAuth } from "../../hooks/useAuth";

function TransactionModal({ type, onClose, onSave, initialData }) {
  const user = useAuth();
  const userId = user?.uid;

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [userSubcategories, setUserSubcategories] = useState([]);

  const [isFixed, setIsFixed] = useState(false);
  const [error, setError] = useState("");

  const categories = type === "credit" ? incomeCategories : expenseCategories;
  const isEditing = !!(initialData && initialData.id);

  // 1. Busca as subcategorias do utilizador ao abrir o modal
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (userId) {
        const subs = await CategoryService.getSubcategories(userId);
        setUserSubcategories(subs);
      }
    };
    fetchSubcategories();
  }, [userId]);

  // 2. Preenche os dados se for uma edição
  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || "");
      setValue(
        initialData.value ? Math.round(initialData.value * 100).toString() : "",
      );
      setDate(initialData.date || "");
      setSelectedCategory(initialData.category || "");
      setSelectedSubcategory(initialData.subcategory || ""); // Preenche subcategoria
      setIsFixed(initialData.isFixed || false);
    }
  }, [initialData]);

  // 3. Função para criar uma subcategoria nova e já a selecionar
  const handleAddNewSubcategory = useCallback(
    async (parentCategory, subName) => {
      if (!userId) return;
      try {
        const newSub = await CategoryService.addSubcategory(
          userId,
          parentCategory,
          subName,
        );
        setUserSubcategories((prev) => [...prev, newSub]);
        setSelectedSubcategory(newSub.name); // Já deixa selecionada para o utilizador
      } catch (err) {
        console.error("Erro ao criar subcategoria:", err);
        setError("Falha ao criar subcategoria.");
      }
    },
    [userId],
  );

  const validateForm = useCallback(() => {
    if (!description || !value || !date || !selectedCategory) {
      setError(
        "Por favor, preencha todos os campos obrigatórios (Macro Categoria é obrigatória).",
      );
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
          category: selectedCategory, // Categoria Macro
          subcategory: selectedSubcategory, // Subcategoria (Detalhe)
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
      selectedSubcategory,
      isFixed,
      initialData,
      onClose,
    ],
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
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
            label="Categorização *"
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
            userSubcategories={userSubcategories}
            onAddNewSubcategory={handleAddNewSubcategory}
          />

          <div className="grid grid-cols-2 gap-4">
            <MoneyInput label="Valor *" value={value} onChange={setValue} />
            <TextInput
              label="Data *"
              value={date}
              onChange={setDate}
              type="date"
            />
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2 mb-4 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isFixed"
                checked={isFixed}
                onChange={(e) => setIsFixed(e.target.checked)}
                className="w-5 h-5 text-green-600 bg-white border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="isFixed"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none leading-tight"
              >
                Transação Fixa (Repetir nos próximos 12 meses)
              </label>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mb-4 font-semibold text-center">
              {error}
            </p>
          )}
          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}

export default React.memo(TransactionModal);
