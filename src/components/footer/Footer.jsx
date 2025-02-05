import { useState } from "react";
import HelpModal from "./HelpModal";
import { HiOutlineInformationCircle } from "react-icons/hi";

function Footer() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <footer className="bg-gradient-to-r from-green-700 via-green-800 to-green-900 text-white text-center py-6 mt-10 shadow-inner rounded-t-3xl relative px-4 sm:px-6">
        <div className="container mx-auto flex flex-col items-center">
          <p className="text-sm font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-l from-yellow-500 to-lime-400">
            CashFlow developed by{" "}
            <span className="font-semibold">Miller Felix</span> &copy; 2024
          </p>
        </div>
      </footer>

      {/* Botão de ajuda */}
      <button
        className="fixed bottom-4 right-4 flex items-center justify-center gap-2 bg-green-600 text-white rounded-full p-3 shadow-md hover:bg-green-700 transition-all z-50"
        onClick={() => setIsHelpOpen(true)}
      >
        <HiOutlineInformationCircle size={24} /> {/* Ícone de informação */}
      </button>

      {/* Modal de ajuda */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}

export default Footer;
