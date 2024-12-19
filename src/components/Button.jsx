/* eslint-disable react/prop-types */
function Button({ children }) {
  return (
    <button className="mt-6 py-2 px-4 w-48 bg-yellow-400 text-gray-800 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 block mx-auto">
      {children}
    </button>
  );
}
/* eslint-enable react/prop-types */

export default Button;
