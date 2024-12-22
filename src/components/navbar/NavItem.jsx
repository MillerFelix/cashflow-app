import { Link } from "react-router-dom";

function NavItem({ to, icon, label, onClick }) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-2 py-2 text-green-300 hover:text-lime-400 transition-transform duration-200 active:scale-95 hover:scale-105"
        onClick={onClick}
      >
        {icon} {label}
      </Link>
    </li>
  );
}

export default NavItem;
