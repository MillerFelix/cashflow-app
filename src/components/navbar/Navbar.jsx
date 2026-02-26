import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaSignOutAlt,
  FaChartBar,
  FaBullseye,
  FaWallet,
  FaCreditCard,
} from "react-icons/fa";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import NavItem from "./NavItem";
import HamburgerMenu from "./HamburguerMenu";
import ConfirmationModal from "../common/ConfirmationModal";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const user = useAuth();
  const userName = user?.displayName?.split(" ")[0] || "Usuário";

  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleLogout = useCallback(() => {
    signOut(auth).catch((error) => console.error("Erro ao deslogar:", error));
  }, []);

  const handleConfirmLogout = useCallback(() => {
    handleLogout();
    setShowModal(false);
  }, [handleLogout]);

  // Fecha o menu mobile caso a tela seja redimensionada para Desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-green-700 via-green-800 to-green-950 text-white p-6 md:p-8 shadow-xl rounded-b-3xl z-40 relative">
      <div className="container mx-auto flex justify-between items-center px-2 sm:px-6">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-lime-300 hover:from-yellow-300 hover:to-lime-500 transition-all duration-500"
          onClick={() => setIsOpen(false)}
        >
          Cash$Flow
        </Link>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex flex-wrap gap-8 ml-10 items-center">
          <NavItem
            to="/dashboard"
            icon={<FaChartBar size={18} />}
            label="Dashboard"
          />
          <NavItem
            to="/transactions"
            icon={<FaWallet size={18} />}
            label="Transações"
          />
          <NavItem to="/goals" icon={<FaBullseye size={18} />} label="Metas" />
          <NavItem
            to="/cards"
            icon={<FaCreditCard size={18} />}
            label="Cartões"
          />
        </ul>

        {/* BOTÃO SAIR DESKTOP */}
        <div className="hidden md:block ml-auto">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-xl text-green-100 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
          >
            <FaSignOutAlt size={18} /> Sair
          </button>
        </div>

        {/* BOTÃO MENU MOBILE */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-green-200 p-2 hover:text-white transition-transform duration-200 active:scale-90"
            aria-label="Menu"
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* MENU DROPDOWN MOBILE */}
      <HamburgerMenu
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        onLogout={() => setShowModal(true)}
      />

      {/* MODAL DE SAÍDA */}
      <ConfirmationModal
        showModal={showModal}
        title={`Até logo, ${userName}?`}
        description="Você precisará fazer login novamente para acessar seus dados financeiros."
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowModal(false)}
        confirmText="Sair"
        cancelText="Cancelar"
        confirmBgColor="bg-red-500"
        confirmHoverColor="hover:bg-red-600"
      />
    </nav>
  );
}

export default React.memo(Navbar);
