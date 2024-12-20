import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaChartBar,
  FaWallet,
  FaBullseye,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { auth } from "../firebase"; // Importe o auth do Firebase
import { signOut } from "firebase/auth"; // Importe o signOut do Firebase

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("Logout realizado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao deslogar", error);
      });
  }

  function handleConfirmLogout() {
    handleLogout();
    setShowModal(false); // Fecha o modal após o logout
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
        {/* Nome do App com link para o Dashboard */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-l from-green-500 to-lime-400 hover:bg-gradient-to-r hover:from-yellow-300 hover:to-lime-500 transition-all duration-500"
          onClick={() => setIsOpen(false)} // Fecha o menu, se aberto
        >
          Cash$Flow
        </Link>

        {/* Abas da Navbar */}
        <ul className="hidden md:flex flex-wrap gap-6 ml-10">
          {/* Abas mais próximas do nome */}
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

        {/* Botão "Sair" visível sempre em telas grandes */}
        <div className="ml-6 hidden md:block">
          <button
            onClick={() => setShowModal(true)} // Abre o modal
            className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
          >
            <FaSignOutAlt size={20} /> Sair
          </button>
        </div>

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
          {/* Botão "Sair" dentro do menu hamburguer */}
          <li>
            <button
              onClick={() => setShowModal(true)} // Abre o modal
              className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
            >
              <FaSignOutAlt size={20} /> Sair
            </button>
          </li>
        </ul>
      )}

      {/* Modal de Confirmação para Logout */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Tem certeza que deseja sair?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Você pode continuar usando o aplicativo ou fazer logout.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)} // Fecha o modal
                className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout} // Realiza o logout
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
