import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Renderiza um link individual da Navbar.
 */
function NavItem({ to, icon, label, onClick, isMobile = false }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-2 transition-all duration-200 active:scale-95
          ${isMobile ? "py-3 px-4 rounded-xl" : "py-2 px-1 hover:scale-105"} 
          ${
            isActive
              ? isMobile
                ? "bg-green-800/50 text-lime-400 font-bold"
                : "text-lime-400 font-bold"
              : "text-green-100 hover:text-white"
          }
        `}
      >
        {icon}
        <span className="text-sm tracking-wide">{label}</span>
      </Link>
    </li>
  );
}

export default React.memo(NavItem);
