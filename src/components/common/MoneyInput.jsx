import React, { useCallback } from "react";

/**
 * Componente MoneyInput
 * Input especializado para valores monetários.
 * Ele exibe o valor formatado para o usuário (ex: R$ 10,00), mas envia
 * apenas os números (centavos) para o estado pai, facilitando cálculos no banco de dados.
 */
function MoneyInput({ label, value = "", onChange, error }) {
  // useCallback: Garante que a função de limpeza não seja recriada a cada renderização
  const handleValueChange = useCallback(
    (rawValue) => {
      // Expressão Regular (Regex) que remove tudo que NÃO for número
      const numericValue = rawValue.replace(/[^\d]/g, "");
      onChange(numericValue);
    },
    [onChange],
  );

  // Função auxiliar para formatar o valor visualmente no input
  const formatValue = (val) => {
    if (!val) return "";
    const numericValue = parseInt(val, 10);
    return `R$ ${(numericValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={formatValue(value)}
        onChange={(e) => handleValueChange(e.target.value)}
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

export default React.memo(MoneyInput);
