import React, { useCallback } from "react";

/**
 * Input com máscara para valores monetários
 */
function MoneyInput({
  label,
  value = "",
  onChange,
  error,
  placeholder = "R$ 0,00",
}) {
  const handleValueChange = useCallback(
    (rawValue) => {
      const numericValue = rawValue.replace(/[^\d]/g, "");
      onChange(numericValue);
    },
    [onChange],
  );

  const formatValue = (val) => {
    if (!val) return "";
    const numericValue = parseInt(val, 10);
    return `R$ ${(numericValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type="text"
        value={formatValue(value)}
        placeholder={placeholder}
        onChange={(e) => handleValueChange(e.target.value)}
        className={`w-full p-3 border rounded-xl bg-gray-50 focus:bg-white text-gray-800 font-medium outline-none transition-all
          ${error ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-green-600"}
        `}
      />
      {error && (
        <p className="text-red-500 text-xs font-bold mt-1.5">{error}</p>
      )}
    </div>
  );
}

export default React.memo(MoneyInput);
