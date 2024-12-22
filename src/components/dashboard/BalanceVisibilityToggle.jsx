import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function BalanceVisibilityToggle({ isVisible, setIsVisible }) {
  return (
    <button
      onClick={() => setIsVisible(!isVisible)} // Altera a visibilidade
      className="text-yellow-300 text-2xl"
    >
      {isVisible ? <FaEyeSlash /> : <FaEye />}{" "}
      {/* Mostra ícone baseado na visibilidade */}
    </button>
  );
}

export default BalanceVisibilityToggle;
