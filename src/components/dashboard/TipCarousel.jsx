import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const TipCarousel = ({ tips }) => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    if (!tips || tips.length === 0) return; // Evita erro se `tips` estiver vazio

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [tips]);

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
    <div className="w-full lg:w-[450px] bg-white text-black p-4 rounded-xl flex flex-col items-center justify-between">
      <div className="text-center text-sm font-semibold">Conselhos</div>
      <div className="mt-2 text-center text-sm font-normal flex items-center justify-center gap-2">
        {tips[currentTip]?.icon}
        <p>{tips[currentTip]?.tip}</p>
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
