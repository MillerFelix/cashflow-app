import React from "react";

/**
 * Componente GraphCard
 * Um container estilizado com gradiente para envolver os gráficos do dashboard.
 * Possui alturas mínimas e máximas definidas para manter a consistência visual nos diferentes tamanhos de tela.
 */
function GraphCard({ colorStart, colorEnd, title, children }) {
  return (
    <div
      className={`bg-gradient-to-br ${colorStart} ${colorEnd} rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col justify-between w-full transition-all`}
      style={{
        minHeight: "300px",
        maxHeight: "500px",
      }}
    >
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4">
        {title}
      </h3>
      {/* Container flexível para centralizar o gráfico perfeitamente */}
      <div className="flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
}

export default React.memo(GraphCard);
