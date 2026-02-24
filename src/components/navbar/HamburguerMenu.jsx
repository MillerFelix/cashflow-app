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
    <ul className="absolute right-6 top-20 bg-green-800 p-2 rounded-lg shadow-lg w-48 z-50 transition-all ease-in-out border border-green-700">
      <NavItem
        to="/dashboard"
        icon={<FaChartBar size={20} />}
        label="Dashboard"
        onClick={toggleMenu}
      />
      <NavItem
        to="/transactions"
        icon={<FaWallet size={20} />}
        label="Transações"
        onClick={toggleMenu}
      />
      <NavItem
        to="/goals"
        icon={<FaBullseye size={20} />}
        label="Metas"
        onClick={toggleMenu}
      />
      <NavItem
        to="/cards"
        icon={<FaCreditCard size={20} />}
        label="Cartões"
        onClick={toggleMenu}
      />

      <hr className="border-green-700 my-1" />

      <li>
        <button
          onClick={() => {
            onLogout();
            toggleMenu();
          }}
          className="flex w-full items-center gap-2 py-2 px-4 rounded-lg text-green-300 hover:text-lime-400 hover:bg-green-900/50 transition-all duration-200 active:scale-95"
        >
          <FaSignOutAlt size={20} /> Sair
        </button>
      </li>
    </ul>
  );
}

export default React.memo(HamburgerMenu);
