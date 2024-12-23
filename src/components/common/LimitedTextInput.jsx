function LimitedTextInput({
  label,
  value = "",
  onChange,
  error,
  maxChars,
  maxWords,
  type = "text",
}) {
  function handleInputChange(e) {
    const inputValue = e.target.value;
    if (isInputValid(inputValue)) {
      onChange(inputValue); // Atualiza diretamente o estado no componente pai
    }
  }

  // Função para validar a quantidade de caracteres e palavras
  function isInputValid(inputValue) {
    const charCount = inputValue.length;
    const wordCount = inputValue.trim().split(/\s+/).length;

    return charCount <= maxChars && wordCount <= maxWords;
  }

  // Função para contar palavras
  function countWords(inputValue) {
    return inputValue.trim().split(/\s+/).length;
  }

  // Função para contar caracteres
  function countChars(inputValue) {
    return inputValue.length;
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
      {/* Exibe o contador de caracteres e palavras apenas se maxChars ou maxWords forem passados */}
      {(maxChars || maxWords) && (
        <div className="text-sm text-gray-600 mt-1">
          {countChars(value)} / {maxChars} caracteres | {countWords(value)} /{" "}
          {maxWords} palavras
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default LimitedTextInput;
