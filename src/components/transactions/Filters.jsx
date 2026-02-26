import React from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaRedoAlt,
  FaFilter,
} from "react-icons/fa";

/**
 * Componente Filters
 * Barra de filtros utilizada na página de Transações.
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
    <div className="mb-6 p-1">
      {/* Container Principal Moderno */}
      <div className="flex flex-wrap gap-3 items-center justify-center bg-white p-4 rounded-2xl shadow-md border border-gray-100 relative">
        {/* Ícone decorativo de Filtro */}
        <div className="hidden md:flex absolute -left-3 -top-3 bg-green-600 text-white p-2 rounded-xl shadow-lg transform rotate-[-10deg]">
          <FaFilter size={14} />
        </div>

        {/* Filtro por Mês */}
        <div className="relative group w-full sm:w-auto">
          <input
            type="month"
            name="month"
            value={filters.month}
            onChange={handleFilterChange}
            className="w-full appearance-none bg-green-50/50 border border-green-400 text-green-800 text-sm font-semibold rounded-xl px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-green-50 transition-all hover:border-green-500 cursor-pointer"
            title="Filtrar por mês"
          />
        </div>

        {/* Filtro por Tipo */}
        <div className="relative group w-full sm:w-auto">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full appearance-none bg-green-50/50 border border-green-400 text-green-800 text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-green-50 transition-all hover:border-green-500 cursor-pointer"
          >
            <option value="">Todos os Tipos</option>
            <option value="credit">Entradas</option>
            <option value="debit">Saídas</option>
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 pointer-events-none text-xs" />
        </div>

        {/* Filtro por Categoria (Dropdown Customizado) */}
        <div className="relative w-full sm:w-64">
          <div
            className={`w-full bg-green-50/50 border text-green-800 text-sm font-semibold rounded-xl px-4 py-2.5 shadow-sm cursor-pointer flex justify-between items-center transition-all hover:border-green-500 ${
              showCategoryDropdown
                ? "ring-2 ring-green-600 border-green-600 bg-green-50"
                : "border-green-400"
            }`}
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <span className="truncate">
              {category || "Todas as categorias"}
            </span>
            {showCategoryDropdown ? (
              <FaChevronUp className="text-green-700 flex-shrink-0 ml-2 text-xs" />
            ) : (
              <FaChevronDown className="text-green-600 flex-shrink-0 ml-2 text-xs" />
            )}
          </div>

          {showCategoryDropdown && (
            <div className="absolute w-full bg-white border border-green-200 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-xl z-20 py-1 scrollbar-thin scrollbar-thumb-green-200">
              <div
                className="flex items-center p-3 hover:bg-green-50 cursor-pointer text-gray-500 italic border-b border-gray-100 text-sm"
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
                  className="flex items-center p-3 hover:bg-green-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setCategory(cat.name);
                    handleFilterChange({
                      target: { name: "category", value: cat.name },
                    });
                    setShowCategoryDropdown(false);
                  }}
                >
                  <div className="text-lg mr-3 text-gray-600">{cat.icon}</div>
                  <span className="text-sm font-semibold text-gray-700 truncate">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botão de Limpar Filtros */}
        <button
          onClick={clearFilters}
          title="Limpar todos os filtros"
          className="p-3 bg-green-50 text-green-700 border border-green-400 rounded-xl hover:bg-green-100 hover:text-green-900 active:scale-95 transition-all shadow-sm w-full sm:w-auto flex justify-center items-center"
        >
          <FaRedoAlt size={14} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(Filters);
