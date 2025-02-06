import { FaChevronDown, FaChevronUp, FaRedoAlt } from "react-icons/fa";

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
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
        >
          <option value="">Todos</option>
          <option value="credit">Entrada</option>
          <option value="debit">Saída</option>
        </select>

        <div className="mb-4 relative w-64">
          {/* <label className="block text-sm font-medium text-gray-700">
            Categoria
          </label> */}
          <div
            className={`w-full p-2 mt-4 border rounded-lg cursor-pointer flex justify-between items-center focus:outline-none ${
              filters.category
                ? "focus:ring-2 focus:ring-green-800"
                : "focus:ring-2 focus:ring-gray-300"
            }`}
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            {category || "Selecione uma categoria"}
            {showCategoryDropdown ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {showCategoryDropdown && (
            <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
              {[...expenseCategories, ...incomeCategories].map((cat, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setCategory(cat.name);
                    handleFilterChange({
                      target: { name: "category", value: cat.name },
                    });
                    setShowCategoryDropdown(false);
                  }}
                >
                  <div className="text-xl mr-2">{cat.icon}</div>
                  <span className="text-sm">{cat.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={clearFilters}
          className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          <FaRedoAlt />
        </button>
      </div>
    </div>
  );
}

export default Filters;
