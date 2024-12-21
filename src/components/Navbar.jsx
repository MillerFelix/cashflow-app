import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaSignOutAlt,
  FaChartBar,
  FaBullseye,
  FaWallet,
} from "react-icons/fa";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import NavItem from "./NavItem";
import LogoutModal from "./LogoutModal";
import HamburgerMenu from "./HamburguerMenu";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  const handleLogout = useCallback(() => {
    signOut(auth)
      .then(() => {
        console.log("Logout realizado com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao deslogar", error);
      });
  }, []);

  const handleConfirmLogout = useCallback(() => {
    handleLogout();
    setShowModal(false);
  }, [handleLogout]);

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
        {/* Nome do App */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-l from-green-500 to-lime-400 hover:bg-gradient-to-r hover:from-yellow-300 hover:to-lime-500 transition-all duration-500"
          onClick={() => setIsOpen(false)}
        >
          Cash$Flow
        </Link>

        {/* Abas da Navbar */}
        <ul className="hidden md:flex flex-wrap gap-6 ml-10">
          <NavItem to="/" icon={<FaChartBar size={20} />} label="Dashboard" />
          <NavItem
            to="/transactions"
            icon={<FaWallet size={20} />}
            label="Transações"
          />
          <NavItem to="/goals" icon={<FaBullseye size={20} />} label="Metas" />
        </ul>

        {/* Botão "Sair" */}
        <div className="ml-6 hidden md:block">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
          >
            <FaSignOutAlt size={20} /> Sair
          </button>
        </div>

        {/* Ícone de menu hamburguer */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-green-300 p-2 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Menu Hambúrguer */}
      <HamburgerMenu
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        onLogout={() => setShowModal(true)}
      />

      {/* Modal de Confirmação para Logout */}
      <LogoutModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onLogout={handleConfirmLogout}
      />
    </nav>
  );
}

export default Navbar;
