import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * Componente BalanceVisibilityToggle
 * Um botão simples com ícone de olho para ocultar/mostrar o saldo do usuário (efeito de privacidade).
 */
function BalanceVisibilityToggle({ isVisible, setIsVisible }) {
  return (
    <button
      onClick={() => setIsVisible(!isVisible)}
      className="text-yellow-300 text-2xl hover:text-yellow-400 transition-colors"
      title={isVisible ? "Ocultar saldo" : "Mostrar saldo"} // Adicionado title para acessibilidade
    >
      {isVisible ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
}

export default React.memo(BalanceVisibilityToggle);
