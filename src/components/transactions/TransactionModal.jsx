import { useState } from "react";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import TextInput from "../common/TextInput";
import CategoryDropdown from "../category/CategoryDropdown";
import ActionButtons from "../common/ActionButtons";
import MoneyInput from "../common/MoneyInput";
import LimitedTextInput from "../common/LimitedTextInput";

function TransactionModal({ type, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const maxChars = 35;
  const maxWords = 6;
  const categories = type === "credit" ? incomeCategories : expenseCategories;

  function validateFields() {
    const newErrors = {};
    if (!description.trim()) newErrors.description = "Descrição é obrigatória.";
    if (!value || isNaN(value) || parseFloat(value) <= 0)
      newErrors.amount = "Informe um valor válido.";
    if (!date) newErrors.date = "Data é obrigatória.";
    if (!category) newErrors.category = "Selecione uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave(e) {
    e.preventDefault();
    if (validateFields()) {
      const formattedAmount = parseFloat(value) / 100;
      onSave(type, description, formattedAmount, date, category);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          Adicionar {type === "credit" ? "Crédito" : "Débito"}
        </h3>
        <form onSubmit={handleSave}>
          <LimitedTextInput
            label="Descrição"
            value={description}
            onChange={setDescription}
            error={errors.description}
            maxChars={maxChars}
            maxWords={maxWords}
          />
          <MoneyInput
            label="Valor"
            value={value}
            onChange={setValue}
            error={errors.amount}
          />
          <TextInput
            label="Data"
            type="date"
            value={date}
            onChange={setDate}
            error={errors.date}
          />
          <CategoryDropdown
            label="Categoria"
            categories={categories}
            selectedCategory={category}
            onSelect={setCategory}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            error={errors.category}
          />
          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
