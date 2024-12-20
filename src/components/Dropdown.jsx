import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Dropdown({
  label,
  categories,
  selectedCategory,
  onSelect,
  showDropdown,
  setShowDropdown,
  error,
}) {
  return (
    <div className="mb-4 relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        className={`w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center focus:outline-none ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "focus:ring-2 focus:ring-green-800"
        }`}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCategory || "Selecione uma categoria"}
        {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {showDropdown && (
        <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(cat.name);
                setShowDropdown(false);
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

export default Dropdown;
