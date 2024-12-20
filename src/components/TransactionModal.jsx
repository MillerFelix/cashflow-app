import { useState } from "react";
import Button from "./Button";
import { expenseCategories, incomeCategories } from "./CategoryList";
import TextInput from "./TextInput";
import Dropdown from "./Dropdown";
import ActionButtons from "./ActionButtons";

function TransactionModal({ type, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(""); // Valor inicial vazio
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const maxChars = 50;
  const maxWords = 10;
  const categories = type === "credit" ? incomeCategories : expenseCategories;

  const validateFields = () => {
    const newErrors = {};
    if (!description.trim()) newErrors.description = "Descrição é obrigatória.";
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0)
      newErrors.amount = "Informe um valor válido.";
    if (!date) newErrors.date = "Data é obrigatória.";
    if (!category) newErrors.category = "Selecione uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      const formattedAmount = parseFloat(amount) / 100;
      onSave(type, description, formattedAmount, date, category);
      onClose();
    }
  };

  const handleAmountChange = (rawValue) => {
    // Atualiza apenas o valor bruto
    const numericValue = rawValue.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    setAmount(numericValue);
  };

  const formatAmount = (value) => {
    if (!value) return ""; // Retorna vazio se não houver valor
    const numericValue = parseInt(value, 10); // Garante que é um número inteiro
    return `R$ ${(numericValue / 100).toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          Adicionar {type === "credit" ? "Crédito" : "Débito"}
        </h3>
        <form>
          <TextInput
            label="Descrição"
            value={description}
            onChange={setDescription}
            error={errors.description}
            maxChars={maxChars}
            maxWords={maxWords}
          />
          <TextInput
            label="Valor"
            value={formatAmount(amount)} // Exibe o valor formatado
            onChange={handleAmountChange} // Atualiza o valor bruto
            error={errors.amount}
            isNumeric // Indica que o campo é numérico
          />
          <TextInput
            label="Data"
            type="date"
            value={date}
            onChange={setDate}
            error={errors.date}
          />
          <Dropdown
            label="Categoria"
            categories={categories}
            selectedCategory={category}
            onSelect={setCategory}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            error={errors.category}
          />
        </form>
        <ActionButtons onClose={onClose} onSave={handleSave} />
      </div>
    </div>
  );
}

export default TransactionModal;
