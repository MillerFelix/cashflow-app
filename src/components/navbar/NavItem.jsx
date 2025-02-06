import { Link, useLocation } from "react-router-dom";

function NavItem({ to, icon, label, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center gap-2 py-2 text-green-300 transition-transform duration-200 
          hover:text-lime-400 active:scale-95 hover:scale-105
          ${isActive ? "text-lime-400" : ""}`}
        onClick={onClick}
      >
        {icon} {label}
      </Link>
    </li>
  );
}

export default NavItem;
