import React, { useState } from "react";
import Button from "../common/Button";
import MoneyInput from "../common/MoneyInput";
import { FaWallet, FaCheckCircle } from "react-icons/fa";

/**
 * Componente BalanceModal (Re-proposto)
 * Atua como a tela de Boas-Vindas para registrar a primeira transação do utilizador.
 */
function BalanceModal({ onSave, onClose }) {
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    const numericValue = parseFloat(balance) / 100;

    // Opcional: Se ele digitar 0 ou vazio, deixamos passar (ele começa do zero)
    if (isNaN(numericValue) || numericValue < 0) {
      setError("Por favor, insira um valor válido (pode ser 0).");
      return;
    }

    onSave(numericValue);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FaWallet className="text-3xl text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 text-center">
            Bem-vindo ao CashFlow!
          </h2>
          <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
            Para começarmos a sua jornada financeira, informe o valor total que
            você já possui hoje em suas contas. <br />
            <span className="font-semibold text-gray-700">
              Este será o seu saldo inicial de partida.
            </span>
          </p>
        </div>

        <div className="mb-6">
          <MoneyInput
            label="Saldo Atual Disponível"
            value={balance}
            onChange={setBalance}
          />
          {error && (
            <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSave}
            bgColor="bg-green-600"
            hoverColor="hover:bg-green-700"
            className="w-full text-white py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <FaCheckCircle />
            Começar a Usar
          </Button>

          <button
            onClick={() => onSave(0)} // Permite começar do zero sem registrar saldo inicial
            className="text-gray-400 hover:text-gray-600 text-sm font-medium underline transition-colors"
          >
            Pular (Vou começar do zero)
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(BalanceModal);
