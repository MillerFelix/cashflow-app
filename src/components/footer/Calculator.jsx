import React, { useState, useEffect } from "react";
import { FaTimes, FaBackspace } from "react-icons/fa";

function Calculator({ isOpen, onClose }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) {
      setExpression("");
      setResult("");
    }
  }, [isOpen]);

  const handleDragStart = (e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
      setDragging(true);
      setOffset({ x: clientX - position.x, y: clientY - position.y });
      document.body.style.overflow = "hidden";
    }
  };

  const handleDragMove = (e) => {
    if (!dragging) return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let newX = clientX - offset.x;
    let newY = clientY - offset.y;

    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 350;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > maxX) newX = maxX;
    if (newY > maxY) newY = maxY;

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setDragging(false);
    document.body.style.overflow = "auto";
  };

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
    };
  }, [dragging]);

  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        setResult(eval(expression).toString());
      } catch {
        setResult("Erro");
      }
    } else if (value === "DEL") {
      setExpression(expression.slice(0, -1)); // Remove o último caractere
    } else {
      setExpression(expression + value);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bg-teal-950 text-white rounded-lg shadow-lg p-4 select-none z-50"
      style={{
        top: position.y,
        left: position.x,
        width: "90vw",
        maxWidth: "300px",
        height: "auto",
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <div className="flex justify-between items-center p-2 bg-cyan-800 rounded-t-lg">
        <h2 className="text-md font-bold">Calculadora</h2>
        <FaTimes className="cursor-pointer" onClick={onClose} />
      </div>
      <div className="mt-2 mb-4">
        <input
          type="text"
          value={expression}
          readOnly
          className="w-full text-right text-lg bg-cyan-700 p-2 rounded-md"
        />
        <div className="text-right text-emerald-400 text-lg mt-1">{result}</div>
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
            className="bg-cyan-500 text-black p-2 rounded-md text-lg font-bold hover:bg-sky-600 flex justify-center items-center"
            onClick={() => handleButtonClick(btn)}
          >
            {btn === "DEL" ? <FaBackspace size={20} /> : btn}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;
