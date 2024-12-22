function TextInput({
  label,
  value = "", // Valor padrão para evitar undefined
  onChange,
  error,
  maxChars,
  maxWords,
  type = "text",
  isNumeric,
}) {
  function handleInputChange(e) {
    const inputValue = e.target.value;
    onChange(inputValue); // Atualiza diretamente o estado no componente pai
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleInputChange}
        className={`w-full p-2 border rounded-lg focus:outline-none ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "focus:ring-2 focus:ring-green-800"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default TextInput;
