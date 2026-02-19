import React from "react";

/**
 * Componente ProgressBar
 * Exibe uma barra de progresso visual para indicar o quanto uma meta foi atingida.
 * Muda de cor dependendo se é uma meta de ganho (verde) ou limite de despesa (vermelho).
 */
function ProgressBar({ type, currentValue, goalValue }) {
  // Impede que a barra passe de 100% visualmente, mesmo que o valor ultrapasse a meta
  const progressPercentage = Math.min((currentValue / goalValue) * 100, 100);
  const isComplete = progressPercentage === 100;

  return (
    <div className="relative h-8 rounded-lg overflow-hidden mb-3 flex items-center justify-center shadow-inner">
      {/* Fundo cinza da barra (o "vazio") */}
      <div className="absolute top-0 left-0 h-full w-full bg-gray-300" />

      {/* A barra colorida que cresce (o "preenchido") */}
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
          type === "expense"
            ? "bg-gradient-to-r from-red-600 via-red-800 to-red-900" // Cor para despesas
            : "bg-gradient-to-r from-emerald-300 via-emerald-500 to-green-700" // Cor para ganhos
        }`}
        style={{ width: `${progressPercentage}%` }} // A mágica visual acontece aqui
      />

      {/* Texto de porcentagem ou mensagem de sucesso que fica por cima da barra */}
      <span
        className={`relative font-semibold text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap px-2 z-10 ${
          isComplete
            ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-400 animate-pulse drop-shadow-md"
            : "text-white drop-shadow-md"
        }`}
      >
        {isComplete
          ? type === "expense"
            ? "Limite atingido!"
            : "Meta batida!"
          : `${Math.round(progressPercentage)}%`}
      </span>
    </div>
  );
}

export default React.memo(ProgressBar);
