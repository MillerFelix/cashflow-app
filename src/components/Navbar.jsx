import { Link } from "react-router-dom";
import { FaChartBar, FaWallet, FaBullseye, FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  // Fecha o menu quando a tela for redimensionada para maior que "md"
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-green-700 via-green-800 to-green-950 text-white p-8 shadow-xl rounded-b-3xl">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-l from-green-500 to-lime-400">
          Cash$Flow
        </h1>

        <ul className="hidden md:flex gap-8">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
            >
              <FaChartBar size={20} /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/transactions"
              className="flex items-center gap-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
            >
              <FaWallet size={20} /> Transações
            </Link>
          </li>
          <li>
            <Link
              to="/goals"
              className="flex items-center gap-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
            >
              <FaBullseye size={20} /> Metas
            </Link>
          </li>
        </ul>

        {/* Ícone de menu hamburguer para dispositivos pequenos */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-green-300 p-2 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Caixa do menu - visível em dispositivos pequenos */}
      {isOpen && (
        <ul className="absolute right-6 top-20 bg-green-800 p-2 rounded-lg shadow-lg w-40">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
              onClick={toggleMenu}
            >
              <FaChartBar size={20} /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/transactions"
              className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
              onClick={toggleMenu}
            >
              <FaWallet size={20} /> Transações
            </Link>
          </li>
          <li>
            <Link
              to="/goals"
              className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
              onClick={toggleMenu}
            >
              <FaBullseye size={20} /> Metas
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
