function Button({ children, bgColor, hoverColor, className, ...props }) {
  return (
    <button
      className={`py-2 px-4 font-bold rounded-lg shadow-md transition-colors duration-300 ${bgColor} ${hoverColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
