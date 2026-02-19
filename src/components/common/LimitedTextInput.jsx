import React, { useCallback } from "react";

/**
 * Componente LimitedTextInput
 * Um input de texto que bloqueia a digitação caso o limite de caracteres ou palavras seja atingido.
 * Muito útil para descrições curtas de transações.
 */
function LimitedTextInput({
  label,
  value = "",
  onChange,
  error,
  maxChars,
  maxWords,
  type = "text",
}) {
  // O useCallback garante que a função não seja recriada à toa
  const countWords = useCallback((text) => {
    const trimmed = text.trim();
    // Correção do Bug: se a string for vazia, retorna 0 palavras.
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, []);

  const countChars = (text) => text.length;

  const isInputValid = useCallback(
    (inputValue) => {
      // Se não houver limites definidos, sempre é válido
      if (!maxChars && !maxWords) return true;

      const chars = countChars(inputValue);
      const words = countWords(inputValue);

      const isCharsValid = maxChars ? chars <= maxChars : true;
      const isWordsValid = maxWords ? words <= maxWords : true;

      return isCharsValid && isWordsValid;
    },
    [maxChars, maxWords, countWords],
  );

  function handleInputChange(e) {
    const inputValue = e.target.value;

    // Se o usuário estiver "apagando" ou o texto for válido, atualizamos o estado
    if (inputValue.length < value.length || isInputValid(inputValue)) {
      onChange(inputValue);
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleInputChange}
        className={`w-full p-2 border rounded-lg focus:outline-none transition-colors ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500"
            : "focus:ring-2 focus:ring-green-800"
        }`}
      />

      {/* Exibe o contador apenas se os limites tiverem sido definidos via props */}
      {(maxChars || maxWords) && (
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
          {maxChars && (
            <span>
              {countChars(value)} / {maxChars} letras
            </span>
          )}
          {maxWords && (
            <span>
              {countWords(value)} / {maxWords} palavras
            </span>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default React.memo(LimitedTextInput);
