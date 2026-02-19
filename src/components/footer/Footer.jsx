import React, { useState, useCallback } from "react";
import HelpModal from "./HelpModal";
import Calculator from "./Calculator";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BsCalculator } from "react-icons/bs";

/**
 * Componente Footer
 * Rodapé principal do app. Também gerencia a abertura dos modais flutuantes (Ajuda e Calculadora).
 */
function Footer() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // useCallback evita recriação das funções ao re-renderizar
  const toggleCalculator = useCallback(
    () => setIsCalculatorOpen((prev) => !prev),
    [],
  );
  const openHelp = useCallback(() => setIsHelpOpen(true), []);

  return (
    <>
      <footer className="bg-gradient-to-r from-green-700 via-green-800 to-green-900 text-white text-center py-6 shadow-inner rounded-t-3xl relative px-4 sm:px-6 mt-auto">
        <div className="container mx-auto flex flex-col items-center">
          <p className="text-sm font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-l from-yellow-500 to-lime-400">
            CashFlow developed by{" "}
            <span className="font-semibold">Miller Felix</span> &copy; 2024
          </p>
        </div>
      </footer>

      {/* Botões Flutuantes (Fixos na tela) */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-40">
        <button
          className="flex items-center justify-center bg-green-600 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition-transform hover:scale-110 active:scale-95"
          onClick={toggleCalculator}
          title="Calculadora"
        >
          <BsCalculator size={24} />
        </button>

        <button
          className="flex items-center justify-center bg-green-600 text-white rounded-full p-3 shadow-lg hover:bg-green-700 transition-transform hover:scale-110 active:scale-95"
          onClick={openHelp}
          title="Ajuda"
        >
          <HiOutlineInformationCircle size={24} />
        </button>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <Calculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </>
  );
}

export default React.memo(Footer);
