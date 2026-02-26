import React from "react";
import {
  FaChartBar,
  FaWallet,
  FaBullseye,
  FaSignOutAlt,
  FaCreditCard,
} from "react-icons/fa";
import NavItem from "./NavItem";

function HamburgerMenu({ isOpen, toggleMenu, onLogout }) {
  if (!isOpen) return null;

  return (
    <ul className="absolute right-4 top-20 bg-green-900/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl w-56 z-50 border border-green-700/50 animate-fadeIn">
      <div className="flex flex-col gap-1">
        <NavItem
          to="/dashboard"
          icon={<FaChartBar size={18} />}
          label="Dashboard"
          onClick={toggleMenu}
          isMobile
        />
        <NavItem
          to="/transactions"
          icon={<FaWallet size={18} />}
          label="Transações"
          onClick={toggleMenu}
          isMobile
        />
        <NavItem
          to="/goals"
          icon={<FaBullseye size={18} />}
          label="Metas"
          onClick={toggleMenu}
          isMobile
        />
        <NavItem
          to="/cards"
          icon={<FaCreditCard size={18} />}
          label="Cartões"
          onClick={toggleMenu}
          isMobile
        />
      </div>

      <div className="h-px bg-green-800/50 my-2 mx-2" />

      <li>
        <button
          onClick={() => {
            onLogout();
            toggleMenu();
          }}
          className="flex w-full items-center gap-3 py-3 px-4 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-900/30 transition-all duration-200 active:scale-95 font-medium"
        >
          <FaSignOutAlt size={18} /> Sair
        </button>
      </li>
    </ul>
  );
}

export default React.memo(HamburgerMenu);
