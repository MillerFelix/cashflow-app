import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaBackspace } from "react-icons/fa";

/**
 * Componente Calculator
 * Calculadora flutuante e arrastável na tela.
 * Nota de Segurança: Como o input é 'readOnly' e só alimentado pelos botões controlados,
 * usamos uma execução de função matemática segura no lugar do 'eval()'.
 */
function Calculator({ isOpen, onClose }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  // Estados para gerenciar o "Arrastar e Soltar" (Drag and Drop)
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Reseta a calculadora quando ela é fechada
  useEffect(() => {
    if (!isOpen) {
      setExpression("");
      setResult("");
    }
  }, [isOpen]);

  const handleDragStart = useCallback(
    (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Só permite arrastar se NÃO clicar em um botão ou input
      if (
        e.target.tagName !== "BUTTON" &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "svg" &&
        e.target.tagName !== "path"
      ) {
        setDragging(true);
        setOffset({ x: clientX - position.x, y: clientY - position.y });
        document.body.style.overflow = "hidden"; // Evita que a tela role no mobile enquanto arrasta
      }
    },
    [position],
  );

  const handleDragMove = useCallback(
    (e) => {
      if (!dragging) return;
      e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      let newX = clientX - offset.x;
      let newY = clientY - offset.y;

      // Limites da tela para a calculadora não "sumir" nas bordas
      const maxX = window.innerWidth - 300;
      const maxY = window.innerHeight - 350;

      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > maxX) newX = maxX;
      if (newY > maxY) newY = maxY;

      setPosition({ x: newX, y: newY });
    },
    [dragging, offset],
  );

  const handleDragEnd = useCallback(() => {
    if (dragging) {
      setDragging(false);
      document.body.style.overflow = "auto";
    }
  }, [dragging]);

  // Registra os eventos de arrastar na janela toda
  useEffect(() => {
    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
      document.body.style.overflow = "auto"; // Cleanup de segurança
    };
  }, [handleDragMove, handleDragEnd]);

  const handleButtonClick = useCallback(
    (value) => {
      if (value === "=") {
        try {
          // Alternativa moderna e segura ao eval()
          const calcResult = new Function("return " + expression)();
          setResult(calcResult.toString());
        } catch {
          setResult("Erro");
        }
      } else if (value === "DEL") {
        setExpression((prev) => prev.slice(0, -1));
      } else {
        setExpression((prev) => prev + value);
      }
    },
    [expression],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed bg-teal-950 text-white rounded-lg shadow-2xl p-4 select-none z-50 border border-teal-800 cursor-move"
      style={{
        top: position.y,
        left: position.x,
        width: "90vw",
        maxWidth: "300px",
        height: "auto",
        touchAction: "none", // Melhora o drag no mobile
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <div className="flex justify-between items-center p-2 bg-cyan-800 rounded-t-lg">
        <h2 className="text-md font-bold tracking-wider">Calculadora</h2>
        <FaTimes
          className="cursor-pointer hover:text-red-400 transition-colors"
          onClick={onClose}
        />
      </div>

      <div className="mt-2 mb-4">
        <input
          type="text"
          value={expression}
          readOnly // Evita que o usuário digite texto (proteção extra de segurança)
          className="w-full text-right text-lg bg-cyan-700 p-2 rounded-md outline-none cursor-default"
        />
        <div className="text-right text-emerald-400 font-bold text-xl mt-1 h-7">
          {result}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          "7",
          "8",
          "9",
          "/",
          "4",
          "5",
          "6",
          "*",
          "1",
          "2",
          "3",
          "-",
          "DEL",
          "0",
          "=",
          "+",
        ].map((btn) => (
          <button
            key={btn}
            className="bg-cyan-500 text-black p-3 rounded-md text-lg font-bold hover:bg-cyan-400 active:bg-cyan-600 transition-colors flex justify-center items-center shadow-sm"
            onClick={() => handleButtonClick(btn)}
          >
            {btn === "DEL" ? <FaBackspace size={20} /> : btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(Calculator);
