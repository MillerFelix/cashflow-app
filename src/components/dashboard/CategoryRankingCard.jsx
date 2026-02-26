import React from "react";
import { FaTags } from "react-icons/fa";

function CategoryRankingCard({ categoryRanking, isVisible, formatCurrency }) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
      <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
        <FaTags className="text-blue-500" /> Para onde foi seu dinheiro
      </h3>
      {categoryRanking.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-400 text-xs italic">
          Nenhum gasto registrado neste mês.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {categoryRanking.map((item, index) => (
            <div key={item.name} className="relative">
              <div className="flex justify-between items-end mb-1.5 z-10 relative">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold ${index === 0 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-500"}`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-sm font-bold truncate ${index === 0 ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`block text-sm font-bold ${index === 0 ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {isVisible ? formatCurrency(item.value) : "••••"}
                  </span>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden flex items-center relative">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${index === 0 ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-300"}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
                <span className="absolute right-0 -top-5 text-[10px] text-gray-400 font-medium">
                  {Math.round(item.percentage)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default React.memo(CategoryRankingCard);
