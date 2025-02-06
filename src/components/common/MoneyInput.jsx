function MoneyInput({ label, value = "", onChange, error }) {
  function handleValueChange(rawValue) {
    const numericValue = rawValue.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
    onChange(numericValue); // Atualiza o valor bruto (ainda em centavos)
  }

  const formatValue = (value) => {
    if (!value) return ""; // Retorna vazio se não houver valor
    const numericValue = parseInt(value, 10); // Garante que é um número inteiro
    return `R$ ${(numericValue / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={formatValue(value)}
        onChange={(e) => handleValueChange(e.target.value)}
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

export default MoneyInput;
