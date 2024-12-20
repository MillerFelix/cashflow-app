function Button({ children, bgColor, hoverColor, className, ...props }) {
  return (
    <button
      className={`mt-6 py-2 px-4 w-48 font-bold rounded-lg shadow-md transition-colors duration-300 block mx-auto ${bgColor} ${hoverColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
