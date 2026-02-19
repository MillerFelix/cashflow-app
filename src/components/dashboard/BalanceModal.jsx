import React, { useState, useCallback } from "react";
import ActionButtons from "../common/ActionButtons";
import MoneyInput from "../common/MoneyInput";

/**
 * Componente BalanceModal
 * Modal para o usuário atualizar o saldo atual da conta.
 */
function BalanceModal({ onClose, onSave, initialBalance = "" }) {
  const [balance, setBalance] = useState(initialBalance);
  const [error, setError] = useState("");

  const validateBalance = useCallback(() => {
    if (!balance || isNaN(balance) || parseFloat(balance) <= 0) {
      setError("Informe um saldo válido.");
      return false;
    }
    setError("");
    return true;
  }, [balance]);

  const handleSave = useCallback(() => {
    if (validateBalance()) {
      const formattedBalance = parseFloat(balance) / 100;
      onSave(formattedBalance);
      onClose();
    }
  }, [balance, validateBalance, onSave, onClose]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault(); // Previne o reload da página
      handleSave();
    },
    [handleSave],
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Inserir Saldo</h3>
        <form onSubmit={handleSubmit}>
          <MoneyInput
            label="Saldo"
            value={balance}
            onChange={setBalance}
            error={error}
          />
          <ActionButtons onClose={onClose} onSave={handleSave} />
        </form>
      </div>
    </div>
  );
}

export default React.memo(BalanceModal);
