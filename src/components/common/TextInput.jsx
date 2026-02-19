import React from "react";

/**
 * Componente TextInput
 * Input de texto padrão da aplicação. Usado para e-mails, senhas e textos simples.
 * Recebe propriedades para exibir mensagens de erro dinâmicas.
 */
function TextInput({ label, value = "", onChange, error, type = "text" }) {
  function handleInputChange(e) {
    onChange(e.target.value);
  }

  return (
    <div className="mb-4">
      {/* Label com espaçamento (mb-1) ajustado para consistência visual */}
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
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default React.memo(TextInput);
