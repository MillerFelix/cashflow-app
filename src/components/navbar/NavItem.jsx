import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Componente NavItem
 * Renderiza um link individual na Navbar.
 * Ele usa o hook `useLocation` para saber em qual página o usuário está e destacar o link ativo.
 */
function NavItem({ to, icon, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-2 py-2 transition-transform duration-200 
          active:scale-95 hover:scale-105
          ${isActive ? "text-lime-400 font-bold" : "text-green-300 hover:text-lime-400"}`}
        onClick={onClick}
      >
        {icon} {label}
      </Link>
    </li>
  );
}

export default React.memo(NavItem);
