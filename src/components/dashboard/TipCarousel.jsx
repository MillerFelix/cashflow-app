import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

/**
 * Componente TipCarousel
 * Um carrossel automático (e manual) que rotaciona dicas financeiras a cada 7 segundos.
 */
const TipCarousel = ({ tips }) => {
  const [currentTip, setCurrentTip] = useState(0);

  // Efeito para rodar o carrossel automaticamente
  useEffect(() => {
    // Evita rodar o loop se não houver dicas
    if (!tips || tips.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 7000);

    // Função de limpeza: Impede que o timer continue rodando na memória se o componente for destruído
    return () => clearInterval(interval);
  }, [tips]);

  // Funções de navegação manual memorizadas (useCallback) para não recriar os botões à toa
  const handlePrev = useCallback(() => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  }, [tips.length]);

  const handleNext = useCallback(() => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  }, [tips.length]);

  if (!tips || tips.length === 0) {
    return (
      <div className="w-full lg:w-[350px] bg-white text-black p-4 rounded-xl flex flex-col items-center justify-center">
        <p className="text-sm font-semibold text-gray-500">
          Nenhuma dica disponível
        </p>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[450px] bg-white text-black p-4 rounded-xl flex flex-col items-center justify-between shadow-md">
      <div className="text-center text-sm font-semibold text-teal-700">
        Conselhos Inteligentes
      </div>

      {/* Exibição da dica atual */}
      <div className="mt-2 text-center text-sm font-normal flex flex-col items-center justify-center gap-2 min-h-[60px]">
        {tips[currentTip]?.icon}
        <p>{tips[currentTip]?.tip}</p>
      </div>

      {/* Controles de Navegação */}
      <div className="mt-4 flex justify-center items-center gap-4">
        <AiOutlineLeft
          onClick={handlePrev}
          className="cursor-pointer text-teal-500 hover:text-teal-700 transition duration-200"
          size={20}
        />
        <div className="text-sm text-teal-500 font-semibold">
          {currentTip + 1} / {tips.length}
        </div>
        <AiOutlineRight
          onClick={handleNext}
          className="cursor-pointer text-teal-500 hover:text-teal-700 transition duration-200"
          size={20}
        />
      </div>
    </div>
  );
};

export default React.memo(TipCarousel);
