import React from "react";

function ProgressBar({ type, currentValue, goalValue }) {
  const progressPercentage = (currentValue / goalValue) * 100;

  return (
    <div className="relative h-6 rounded-full overflow-hidden mb-4">
      {/* Fundo da barra */}
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
          type === "expense" ? "bg-green-500" : "bg-white"
        }`}
        style={{
          width: "100%",
        }}
      />
      {/* Barra de progresso */}
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
          type === "expense" ? "bg-orange-500" : "bg-green-500"
        }`}
        style={{
          width: `${Math.min(progressPercentage, 100)}%`,
        }}
      />
    </div>
  );
}

export default ProgressBar;
