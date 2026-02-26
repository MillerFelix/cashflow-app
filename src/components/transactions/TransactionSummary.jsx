import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

/**
 * Componente que exibe os blocos verdes e vermelhos com o total de entradas e saídas.
 */
function TransactionSummary({ totalIncomes, totalExpenses }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-green-200 transition-colors">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Entradas
          </p>
          <p className="text-2xl font-black text-green-600 group-hover:scale-105 transition-transform origin-left">
            {totalIncomes.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:bg-green-100 transition-colors">
          <FaArrowUp />
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-red-200 transition-colors">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            Saídas
          </p>
          <p className="text-2xl font-black text-red-600 group-hover:scale-105 transition-transform origin-left">
            {totalExpenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded-full text-red-600 group-hover:bg-red-100 transition-colors">
          <FaArrowDown />
        </div>
      </div>
    </div>
  );
}

export default React.memo(TransactionSummary);
