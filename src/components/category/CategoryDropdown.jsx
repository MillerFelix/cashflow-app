import React, { useState, useMemo } from "react";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";

/**
 * Componente CategoryDropdown (Nível 2.0)
 * Permite selecionar a Categoria Macro (fixa) e a Subcategoria (personalizável).
 * Permite também criar uma nova subcategoria diretamente na interface.
 */
function CategoryDropdown({
  label,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSubcategory,
  onSelectSubcategory,
  userSubcategories = [],
  onAddNewSubcategory,
}) {
  const [isCreatingSub, setIsCreatingSub] = useState(false);
  const [newSubName, setNewSubName] = useState("");

  // Filtra as subcategorias para mostrar apenas as que pertencem à categoria macro selecionada
  const currentSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return userSubcategories.filter(
      (sub) =>
        sub.parentCategory === selectedCategory && sub.isActive !== false,
    );
  }, [userSubcategories, selectedCategory]);

  const handleMacroChange = (e) => {
    onSelectCategory(e.target.value);
    onSelectSubcategory(""); // Limpa a subcategoria ao mudar a macro
    setIsCreatingSub(false);
  };

  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubName.trim() || !selectedCategory) return;

    await onAddNewSubcategory(selectedCategory, newSubName.trim());
    setNewSubName("");
    setIsCreatingSub(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>

      <div className="flex flex-col gap-3">
        {/* 1º NÍVEL: Categoria Macro */}
        <select
          value={selectedCategory}
          onChange={handleMacroChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
        >
          <option value="" disabled>
            Selecione a Categoria Principal...
          </option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* 2º NÍVEL: Subcategoria (Só aparece se uma Macro estiver selecionada) */}
        {selectedCategory && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Subcategoria (Opcional, mas recomendado)
            </label>

            {!isCreatingSub ? (
              <div className="flex gap-2">
                <select
                  value={selectedSubcategory || ""}
                  onChange={(e) => onSelectSubcategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 bg-white text-sm"
                >
                  <option value="">Geral ({selectedCategory})</option>
                  {currentSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsCreatingSub(true)}
                  className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors flex-shrink-0"
                  title="Criar nova subcategoria"
                >
                  <FaPlus />
                </button>
              </div>
            ) : (
              /* Modo Criação Inline */
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Mercado do mês..."
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full p-2 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateSubcategory}
                  disabled={!newSubName.trim()}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex-shrink-0"
                  title="Salvar Subcategoria"
                >
                  <FaCheck />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingSub(false)}
                  className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors flex-shrink-0"
                  title="Cancelar"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(CategoryDropdown);
