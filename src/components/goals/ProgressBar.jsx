import React from "react";

function ProgressBar({ type, currentValue, goalValue }) {
  const progressPercentage = Math.min((currentValue / goalValue) * 100, 100);

  return (
    <div className="relative h-8 rounded-lg overflow-hidden mb-3">
      {/* Fundo estático */}
      <div className="absolute top-0 left-0 h-full w-full bg-gray-300" />
      {/* Barra de progresso */}
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
          type === "expense"
            ? "bg-gradient-to-r from-red-600 via-red-800 to-red-900"
            : "bg-gradient-to-r from-emerald-300 via-emerald-500 to-green-700"
        }`}
        style={{
          width: `${progressPercentage}%`,
        }}
      />
      {/* Texto de progresso */}
      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-semibold">
        {`${Math.round(progressPercentage)}%`}
      </span>
    </div>
  );
}

export default ProgressBar;
