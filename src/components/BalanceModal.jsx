import { useState } from "react";
import TextInput from "./TextInput";

function BalanceModal({ onClose, onSave, initialBalance = "" }) {
  const [balance, setBalance] = useState(initialBalance);
  const [error, setError] = useState("");

  const validateBalance = () => {
    if (!balance || isNaN(balance) || parseFloat(balance) <= 0) {
      setError("Informe um saldo válido.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSave = () => {
    if (validateBalance()) {
      const formattedBalance = parseFloat(balance) / 100;
      onSave(formattedBalance);
      onClose();
    }
  };

  const handleBalanceChange = (rawValue) => {
    const numericValue = rawValue.replace(/[\D]/g, "");
    setBalance(numericValue);
  };

  const formatBalance = (value) => {
    if (!value) return "";
    const numericValue = parseInt(value, 10);
    return `R$ ${(numericValue / 100).toFixed(2).replace(".", ",")}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Inserir Saldo</h3>
        <form>
          <TextInput
            label="Saldo"
            value={formatBalance(balance)}
            onChange={handleBalanceChange}
            error={error}
            isNumeric
          />
        </form>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BalanceModal;
