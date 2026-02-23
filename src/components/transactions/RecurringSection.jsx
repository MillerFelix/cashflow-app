import React, { useState } from "react";
import { FaCheckCircle, FaClock, FaEdit, FaCheck } from "react-icons/fa";

function RecurringSection({ transactions, onConfirmValue }) {
  // Filtra apenas as fixas (recorrentes) do mês atual
  const recurringItems = transactions
    .filter((t) => t.isFixed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (recurringItems.length === 0) return null;

  // Estado local para edição rápida de valor
  const [editingId, setEditingId] = useState(null);
  const [tempValue, setTempValue] = useState("");

  const startEditing = (t) => {
    setEditingId(t.id);
    setTempValue((t.value * 100).toFixed(0)); // Prepara para input (ex: 10000 para 100.00)
  };

  const handleConfirm = (id) => {
    const finalValue = parseFloat(tempValue) / 100;
    if (!isNaN(finalValue) && finalValue > 0) {
      onConfirmValue(id, finalValue);
      setEditingId(null);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  // Verifica se a data já passou ou é hoje (para cobrar confirmação)
  const isDatePassedOrToday = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr <= today;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-indigo-100 overflow-hidden mb-6">
      <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex justify-between items-center">
        <h3 className="font-bold text-indigo-900 text-sm sm:text-base">
          Transações Recorrentes (Contas/Assinaturas)...
        </h3>
        <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
          {recurringItems.length}
        </span>
      </div>

      <div className="divide-y divide-gray-50">
        {recurringItems.map((t) => {
          // Precisa confirmar se: Não está confirmada E a data já chegou
          const needsConfirmation =
            !t.isConfirmed && isDatePassedOrToday(t.date);

          return (
            <div
              key={t.id}
              className={`px-4 py-3 flex items-center justify-between gap-3 transition-colors ${needsConfirmation ? "bg-orange-50" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`text-lg ${t.isConfirmed ? "text-green-500" : needsConfirmation ? "text-orange-500" : "text-gray-300"}`}
                >
                  {t.isConfirmed ? <FaCheckCircle /> : <FaClock />}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {t.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Venc: {formatDate(t.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {editingId === t.id ? (
                  <div className="flex items-center gap-1 animate-fadeIn">
                    <input
                      autoFocus
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-20 px-2 py-1 border border-indigo-300 rounded text-sm font-bold outline-none"
                      placeholder="Centavos"
                    />
                    <button
                      onClick={() => handleConfirm(t.id)}
                      className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      <FaCheck size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${needsConfirmation ? "text-orange-600" : "text-gray-800"}`}
                    >
                      {formatCurrency(t.value)}
                    </p>
                    {needsConfirmation && (
                      <button
                        onClick={() => startEditing(t)}
                        className="text-[10px] font-bold text-orange-600 hover:text-orange-800 underline flex items-center justify-end gap-1 w-full"
                      >
                        <FaEdit /> Confirmar valor
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecurringSection;
