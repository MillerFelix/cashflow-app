import { FaChartBar, FaWallet, FaBullseye, FaSignOutAlt } from "react-icons/fa";
import NavItem from "./NavItem";

function HamburgerMenu({ isOpen, toggleMenu, onLogout }) {
  if (!isOpen) return null;

  return (
    <ul className="absolute right-6 top-20 bg-green-800 p-2 rounded-lg shadow-lg w-40 z-50 transition-all ease-in-out">
      <NavItem
        to="/"
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
      <li>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
        >
          <FaSignOutAlt size={20} /> Sair
        </button>
      </li>
    </ul>
  );
}

export default HamburgerMenu;
