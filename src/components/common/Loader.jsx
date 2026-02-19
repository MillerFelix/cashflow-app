import React from "react";

/**
 * Componente Loader
 * Exibe um indicador de carregamento (spinner) centralizado com um fundo escuro e desfocado.
 * Ideal para bloquear a tela enquanto o Firebase processa alguma requisição.
 */
function Loader() {
  return (
    // Overlay: cobre a tela toda (inset-0) com z-index 50 para ficar por cima de tudo
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      {/* Círculo animado (spinner) usando bordas do Tailwind */}
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent border-dashed rounded-full animate-spin"></div>
    </div>
  );
}

export default React.memo(Loader);
