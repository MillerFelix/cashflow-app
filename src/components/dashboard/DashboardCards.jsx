import React from "react";
import { FaWallet, FaChartLine, FaClock } from "react-icons/fa";

function DashboardCards({
  transactionsLoading,
  isVisible,
  globalBalance,
  projectedBalance,
  daysUntilPayday,
  financialPace,
  formatCurrency,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="p-6 rounded-3xl shadow-lg text-white bg-gradient-to-br from-emerald-600 to-teal-900 flex flex-col justify-between relative overflow-hidden h-40 group hover:scale-[1.01] transition-transform">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 opacity-90 mb-1">
            <FaWallet className="text-emerald-200" />
            <p className="text-xs font-bold uppercase tracking-widest">
              Saldo Atual
            </p>
          </div>
          <h2 className="text-3xl font-black tracking-tight mt-2">
            {transactionsLoading
              ? "..."
              : isVisible
                ? formatCurrency(globalBalance)
                : "••••••"}
          </h2>
        </div>
        <p className="text-[10px] text-emerald-100/70 font-medium">
          Disponível em conta
        </p>
      </div>

      <div className="p-6 rounded-3xl shadow-lg text-white bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col justify-between relative overflow-hidden h-40 group hover:scale-[1.01] transition-transform">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 opacity-90 mb-1">
            <FaChartLine className="text-blue-200" />
            <p className="text-xs font-bold uppercase tracking-widest">
              Previsão Final
            </p>
          </div>
          <h2 className="text-3xl font-black tracking-tight mt-2">
            {transactionsLoading
              ? "..."
              : isVisible
                ? formatCurrency(projectedBalance)
                : "••••••"}
          </h2>
        </div>
        {daysUntilPayday !== null ? (
          <p className="text-xs text-blue-100 font-bold bg-blue-800/30 py-1 px-2 rounded-lg inline-block w-max items-center gap-1">
            <FaClock size={10} /> Faltam {daysUntilPayday} dias para receber
          </p>
        ) : (
          <p className="text-[10px] text-blue-100/70 font-medium">
            Previsão baseada em agendamentos.
          </p>
        )}
      </div>

      <div
        className={`p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden h-40 transition-colors duration-500 ${financialPace.color === "red" ? "bg-gradient-to-br from-red-600 to-rose-900" : financialPace.color === "yellow" ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-gradient-to-br from-green-600 to-emerald-800"}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Ritmo Atual
            </p>
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              {financialPace.icon}
            </div>
          </div>
          <h2 className="text-xl font-black tracking-tight leading-none">
            {transactionsLoading ? "..." : financialPace.title}
          </h2>
        </div>
        <p className="text-xs font-medium opacity-90 leading-snug mt-2">
          {financialPace.message}
        </p>
      </div>
    </div>
  );
}
export default React.memo(DashboardCards);
