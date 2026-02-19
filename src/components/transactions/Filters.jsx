import React from "react";
import { FaChevronDown, FaChevronUp, FaRedoAlt } from "react-icons/fa";

/**
 * Componente Filters
 * Barra de filtros utilizada na página de Transações.
 * Permite filtrar por Data, Tipo (Entrada/Saída) e Categoria.
 */
function Filters({
  filters,
  handleFilterChange,
  clearFilters,
  showCategoryDropdown,
  setShowCategoryDropdown,
  category,
  setCategory,
  expenseCategories,
  incomeCategories,
}) {
  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap gap-7 items-center justify-center">
        {/* Filtro por Data */}
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-shadow"
        />

        {/* Filtro por Tipo */}
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-shadow"
        >
          <option value="">Todos os Tipos</option>
          <option value="credit">Entrada</option>
          <option value="debit">Saída</option>
        </select>

        {/* Filtro por Categoria (Dropdown Customizado) */}
        <div className="mb-4 relative w-64">
          <div
            className={`w-full p-2 mt-4 border rounded-lg cursor-pointer flex justify-between items-center focus:outline-none transition-shadow ${
              filters.category
                ? "focus:ring-2 focus:ring-green-800"
                : "focus:ring-2 focus:ring-gray-300 hover:border-gray-400"
            }`}
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <span className="truncate">
              {category || "Selecione uma categoria"}
            </span>
            {showCategoryDropdown ? (
              <FaChevronUp className="flex-shrink-0 ml-2" />
            ) : (
              <FaChevronDown className="flex-shrink-0 ml-2" />
            )}
          </div>

          {showCategoryDropdown && (
            <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-xl z-20">
              {/* Opção para limpar apenas a categoria */}
              <div
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer text-gray-500 italic border-b"
                onClick={() => {
                  setCategory("");
                  handleFilterChange({
                    target: { name: "category", value: "" },
                  });
                  setShowCategoryDropdown(false);
                }}
              >
                Todas as categorias
              </div>

              {[...expenseCategories, ...incomeCategories].map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => {
                    setCategory(cat.name);
                    handleFilterChange({
                      target: { name: "category", value: cat.name },
                    });
                    setShowCategoryDropdown(false);
                  }}
                >
                  <div className="text-xl mr-2">{cat.icon}</div>
                  <span className="text-sm truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Limpar todos os Filtros */}
        <button
          onClick={clearFilters}
          title="Limpar todos os filtros"
          className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 active:scale-95 transition-all shadow-sm"
        >
          <FaRedoAlt />
        </button>
      </div>
    </div>
  );
}

export default React.memo(Filters);
