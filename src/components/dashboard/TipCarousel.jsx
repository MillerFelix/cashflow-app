import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const TipCarousel = ({ tips }) => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000); // Muda a dica a cada 5 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [tips.length]);

  return (
    <div className="w-full lg:w-[350px] bg-white text-black p-4 rounded-xl flex flex-col items-center justify-between">
      <div className="text-center text-sm font-semibold">Conselhos</div>
      <div className="mt-2 text-center text-sm font-normal flex items-center justify-center gap-2">
        {/* Renderizando o ícone */}
        {tips[currentTip].icon}
        {/* Renderizando o texto */}
        <p>{tips[currentTip].tip}</p>
      </div>

      <div className="mt-4 flex justify-center items-center gap-4">
        <AiOutlineLeft
          onClick={() =>
            setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
          }
          className="cursor-pointer text-teal-500 hover:text-teal-600 transition duration-200"
          size={20}
        />
        <div className="text-sm text-teal-500 font-semibold">
          {currentTip + 1} / {tips.length}
        </div>
        <AiOutlineRight
          onClick={() => setCurrentTip((prev) => (prev + 1) % tips.length)}
          className="cursor-pointer text-teal-500 hover:text-teal-600 transition duration-200"
          size={20}
        />
      </div>
    </div>
  );
};

export default TipCarousel;
