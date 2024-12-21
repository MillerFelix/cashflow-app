import { useState } from "react";
import TextInput from "./TextInput";

function BalanceModal({ onClose, onSave, initialBalance = "" }) {
  const [balance, setBalance] = useState(initialBalance);
  const [error, setError] = useState("");

  const validateBalance = () => {
    // Validar com o valor numérico sem formatação
    const numericValue = parseFloat(balance);
    if (isNaN(numericValue) || numericValue <= 0) {
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
    const numericValue = rawValue.replace(/[^0-9]/g, ""); // Remove qualquer coisa que não seja número
    setBalance(numericValue); // Armazenar o valor sem formatação
  };

  const formatBalance = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, ""); // Remove tudo que não for número
    return `R$ ${numericValue.replace(/(\d)(\d{3})(\d{1,2}$)/, "$1.$2,$3")}`; // Formatação com ponto e vírgula
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
