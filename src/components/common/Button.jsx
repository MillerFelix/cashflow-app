import React from "react";

/**
 * Componente Button
 * Botão genérico e reutilizável para toda a aplicação.
 * Por padrão, usa type="button" para evitar envios acidentais quando colocado dentro de formulários.
 */
function Button({
  children,
  bgColor,
  hoverColor,
  className,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`py-2 px-4 font-bold rounded-lg shadow-md transition-colors duration-300 ${bgColor} ${hoverColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default React.memo(Button);
