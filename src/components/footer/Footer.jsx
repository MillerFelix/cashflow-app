import React, { useState, useCallback } from "react";
import HelpModal from "./HelpModal";
import Calculator from "./Calculator";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BsCalculator } from "react-icons/bs";

/**
 * Rodapé do App e Gerenciador de Modais Flutuantes (Ajuda / Calculadora).
 */
function Footer() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const toggleCalculator = useCallback(
    () => setIsCalculatorOpen((prev) => !prev),
    [],
  );
  const openHelp = useCallback(() => setIsHelpOpen(true), []);

  return (
    <>
      <footer className="bg-gradient-to-r from-green-700 via-green-800 to-green-950 text-white text-center py-6 shadow-inner rounded-t-3xl relative mt-auto border-t border-green-600/30">
        <div className="container mx-auto flex flex-col items-center justify-center space-y-1">
          <p className="text-xs font-light tracking-wide text-green-100">
            CashFlow developed by{" "}
            <span className="font-semibold text-lime-400">Miller Felix</span>{" "}
            &copy; {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-green-300/50 font-mono tracking-widest uppercase">
            v1.0.0-Beta
          </p>
        </div>
      </footer>

      {/* Botões Flutuantes */}
      <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-40">
        <button
          onClick={toggleCalculator}
          title="Calculadora"
          className="flex items-center justify-center bg-green-600/90 backdrop-blur-md text-white rounded-full p-3.5 shadow-lg border border-green-500/50 hover:bg-green-600 transition-all hover:scale-110 active:scale-95"
        >
          <BsCalculator size={22} />
        </button>

        <button
          onClick={openHelp}
          title="Ajuda"
          className="flex items-center justify-center bg-green-600/90 backdrop-blur-md text-white rounded-full p-3.5 shadow-lg border border-green-500/50 hover:bg-green-600 transition-all hover:scale-110 active:scale-95"
        >
          <HiOutlineInformationCircle size={22} />
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
