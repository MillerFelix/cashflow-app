import { useState } from "react";
import ActionButtons from "../common/ActionButtons";
import MoneyInput from "../common/MoneyInput";

function BalanceModal({ onClose, onSave, initialBalance = "" }) {
  const [balance, setBalance] = useState(initialBalance);
  const [error, setError] = useState("");

  function validateBalance() {
    if (!balance || isNaN(balance) || parseFloat(balance) <= 0) {
      setError("Informe um saldo válido.");
      return false;
    }
    setError("");
    return true;
  }

  function handleSave() {
    if (validateBalance()) {
      const formattedBalance = parseFloat(balance) / 100;
      onSave(formattedBalance);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Inserir Saldo</h3>
        <form>
          <MoneyInput
            label="Saldo"
            value={balance} // Passa o valor bruto
            onChange={setBalance} // Atualiza o estado diretamente
            error={error}
          />
        </form>
        <ActionButtons onClose={onClose} onSave={handleSave} />
      </div>
    </div>
  );
}

export default BalanceModal;
