import React from "react";

/**
 * Componente Card
 * Um cartão estilizado usado principalmente no Dashboard para exibir resumos financeiros.
 * Ele aceita cores customizadas de gradiente do Tailwind para diferenciar Receitas, Despesas e Saldo.
 */
function Card({
  colorStart,
  colorEnd,
  title,
  button,
  children,
  onButtonClick,
}) {
  return (
    <div
      className={`bg-gradient-to-br ${colorStart} ${colorEnd} rounded-xl shadow-lg p-8 flex flex-col justify-between w-full sm:w-1/2 lg:w-1/3 transition-transform hover:scale-[1.02]`}
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>

      {/* Aqui geralmente é renderizado o valor em R$ (ex: Saldo) */}
      <div className="mt-4">
        <div className="text-3xl font-semibold text-yellow-300">{children}</div>
      </div>

      {/* Botão de ação na base do card */}
      <button
        onClick={onButtonClick}
        className="mt-4 px-4 py-2 bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 rounded-lg transition-colors"
      >
        {button}
      </button>
    </div>
  );
}

export default React.memo(Card);
