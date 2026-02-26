import React from "react";

/**
 * Componente genérico de Botão
 */
function Button({
  children,
  bgColor = "bg-green-600",
  hoverColor = "hover:bg-green-700",
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`py-3 px-5 font-bold rounded-xl shadow-md transition-all duration-300 
      ${disabled ? "opacity-50 cursor-not-allowed" : `active:scale-95 ${hoverColor}`} 
      ${bgColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default React.memo(Button);
