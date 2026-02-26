import React from "react";

/**
 * Input de texto padrão
 */
function TextInput({
  label,
  value = "",
  onChange,
  error,
  type = "text",
  placeholder = "",
  required = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`w-full p-3 border rounded-xl bg-gray-50 focus:bg-white text-gray-800 font-medium outline-none transition-all
          ${error ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:ring-2 focus:ring-green-600 focus:border-green-600"}
        `}
      />
      {error && (
        <p className="text-red-500 text-xs font-bold mt-1.5">{error}</p>
      )}
    </div>
  );
}

export default React.memo(TextInput);
