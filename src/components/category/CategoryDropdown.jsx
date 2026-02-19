import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

/**
 * Componente CategoryDropdown
 * Menu suspenso (dropdown) para seleção de categorias com ícones.
 * Ele gerencia seu próprio estado de "aberto/fechado" (isOpen) para evitar que o componente pai precise controlar isso.
 */
function CategoryDropdown({
  label,
  categories,
  selectedCategory,
  onSelect,
  error,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Botão principal que abre/fecha o dropdown */}
      <div
        className={`w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center focus:outline-none transition-colors ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "focus:ring-2 focus:ring-green-800"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategory || "Selecione uma categoria"}
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Lista de opções do dropdown (só renderiza se isOpen for true) */}
      {isOpen && (
        <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                onSelect(cat.name); // Envia a categoria para o pai
                setIsOpen(false); // Fecha o dropdown automaticamente
              }}
            >
              <div className="text-xl mr-2">{cat.icon}</div>
              <span className="text-sm">{cat.name}</span>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default React.memo(CategoryDropdown);
