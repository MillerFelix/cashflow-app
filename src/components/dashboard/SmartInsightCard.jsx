import React from "react";
import { FaLightbulb } from "react-icons/fa";

function SmartInsightCard({ smartInsight, futureExpense, formatCurrency }) {
  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col">
      <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
        <FaLightbulb className="text-yellow-500" /> Inteligência
      </h3>
      <div className="flex flex-col gap-4 flex-grow">
        <div
          className={`p-4 rounded-2xl border-l-4 ${smartInsight.type === "alert" || smartInsight.type === "warning" ? "bg-red-50 border-red-500" : smartInsight.type === "success" ? "bg-green-50 border-green-500" : "bg-blue-50 border-blue-500"}`}
        >
          <h4 className="text-xs font-bold uppercase mb-1 opacity-80">
            Insight do Dia
          </h4>
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {smartInsight.text}
          </p>
        </div>

        {futureExpense > 0 && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
              Próximas Saídas
            </h4>
            <p className="text-sm text-gray-700 leading-snug">
              Você tem <strong>{formatCurrency(futureExpense)}</strong>{" "}
              agendados para sair.
            </p>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 italic">
            "O app aprende com você. Mantenha seu perfil atualizado."
          </p>
        </div>
      </div>
    </div>
  );
}
export default React.memo(SmartInsightCard);
