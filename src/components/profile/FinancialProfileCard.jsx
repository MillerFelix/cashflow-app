import React from "react";
import { FaBriefcase, FaCalendarAlt } from "react-icons/fa";

function FinancialProfileCard({
  workModel,
  setWorkModel,
  payDay,
  setPayDay,
  payDay2,
  setPayDay2,
  financialFocus,
  setFinancialFocus,
}) {
  const focusOptions = [
    { id: "control", label: "Controle", icon: "📊" },
    { id: "debt", label: "Sair das Dívidas", icon: "🆘" },
    { id: "save", label: "Reserva", icon: "🛡️" },
    { id: "invest", label: "Investir", icon: "🚀" },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-indigo-500">
      <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
        <FaBriefcase className="text-indigo-500" /> Perfil Financeiro
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Informações para calibrar as dicas financeiras.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Modelo de Renda
          </label>
          <select
            value={workModel}
            onChange={(e) => setWorkModel(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold text-gray-700"
          >
            <option value="clt">CLT (Salário Fixo)</option>
            <option value="publico">Funcionário Público</option>
            <option value="pj">PJ / Contrato</option>
            <option value="autonomo">Autônomo / Variável</option>
            <option value="estudante">Estudante / Mesada</option>
          </select>
        </div>

        <div className="sm:col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Quando o dinheiro cai?
          </label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-indigo-700 mb-1 block">
                Dia Principal
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaCalendarAlt />
                </div>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={payDay}
                  onChange={(e) => setPayDay(e.target.value)}
                  className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold"
                  placeholder="Ex: 5"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-indigo-700 mb-1 block">
                Adiantamento / Vale (Opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaCalendarAlt />
                </div>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={payDay2}
                  onChange={(e) => setPayDay2(e.target.value)}
                  className="w-full pl-10 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold"
                  placeholder="Ex: 20"
                />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            Preencha o segundo dia se você recebe quinzenalmente (Ex: dia 5 e
            dia 20).
          </p>
        </div>

        <div className="sm:col-span-2 mt-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Foco Atual
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {focusOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFinancialFocus(opt.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${financialFocus === opt.id ? "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
              >
                <span className="text-xl mb-1">{opt.icon}</span>
                <span className="text-xs font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(FinancialProfileCard);
