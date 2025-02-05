import { useState } from "react";
import HelpModal from "./HelpModal";
import Calculator from "./Calculator";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { BsCalculator } from "react-icons/bs";

function Footer() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

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

      {/* Botões Fixos (Ajuda e Calculadora) */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
        {/* Botão de Calculadora */}
        <button
          className="flex items-center justify-center bg-green-600 text-white rounded-full p-3 shadow-md hover:bg-green-700 transition-all"
          onClick={() => setIsCalculatorOpen((prev) => !prev)}
        >
          <BsCalculator size={24} />
        </button>

        {/* Botão de Ajuda */}
        <button
          className="flex items-center justify-center bg-green-600 text-white rounded-full p-3 shadow-md hover:bg-green-700 transition-all"
          onClick={() => setIsHelpOpen(true)}
        >
          <HiOutlineInformationCircle size={24} />
        </button>
      </div>

      {/* Modal de ajuda */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <Calculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </>
  );
}

export default Footer;
