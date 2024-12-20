import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Button from "./Button";
import { expenseCategories, incomeCategories } from "./CategoryList";

/* eslint-disable react/prop-types */
function TransactionModal({ type, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  // Limites
  const maxChars = 50;
  const maxWords = 10;

  const categories = type === "credit" ? incomeCategories : expenseCategories;

  function validateFields() {
    const newErrors = {};
    if (!description.trim()) newErrors.description = "Descrição é obrigatória.";
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0)
      newErrors.amount = "Informe um valor válido.";
    if (!date) newErrors.date = "Data é obrigatória.";
    if (!category) newErrors.category = "Selecione uma categoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (validateFields()) {
      const formattedAmount = parseFloat(amount) / 100;
      onSave(type, description, formattedAmount, date, category);
      onClose();
    }
  }

  function handleAmountChange(e) {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    setAmount(rawValue);
  }

  function formatAmount(value) {
    const numericValue = value.replace(/\D/g, "");
    return numericValue
      ? `R$ ${(numericValue / 100).toFixed(2).replace(".", ",")}`
      : "";
  }

  function handleDescriptionChange(e) {
    const inputValue = e.target.value;
    const wordCount = inputValue.trim().split(/\s+/).length;
    const charCount = inputValue.length;

    // Limita palavras e caracteres
    if (wordCount <= maxWords && charCount <= maxChars) {
      setDescription(inputValue);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          Adicionar {type === "credit" ? "Crédito" : "Débito"}
        </h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={handleDescriptionChange}
              className={`w-full p-2 border rounded-lg focus:outline-none ${
                errors.description
                  ? "border-red-500 focus:ring-2 focus:ring-red-500"
                  : "focus:ring-2 focus:ring-green-800"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {description.length}/{maxChars} caracteres
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {description.trim().split(/\s+/).length}/{maxWords} palavras
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Valor
            </label>
            <input
              type="text"
              value={formatAmount(amount)}
              onChange={handleAmountChange}
              className={`w-full p-2 border rounded-lg focus:outline-none ${
                errors.amount
                  ? "border-red-500 focus:ring-2 focus:ring-red-500"
                  : "focus:ring-2 focus:ring-green-800"
              }`}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full p-2 border rounded-lg focus:outline-none ${
                errors.date
                  ? "border-red-500 focus:ring-2 focus:ring-red-500"
                  : "focus:ring-2 focus:ring-green-800"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <div
              className={`w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center focus:outline-none ${
                errors.category
                  ? "border-red-500 focus:ring-2 focus:ring-red-500"
                  : "focus:ring-2 focus:ring-green-800"
              }`}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {category || "Selecione uma categoria"}
              {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showDropdown && (
              <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCategory(cat.name);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="text-xl mr-2">{cat.icon}</div>
                    <span className="text-sm">{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>
        </form>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={onClose}
            bgColor="bg-gray-200"
            hoverColor="hover:bg-gray-300"
            className="text-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            bgColor="bg-green-600"
            hoverColor="hover:bg-green-700"
            className="text-gray-200"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
/* eslint-enable react/prop-types */

export default TransactionModal;
