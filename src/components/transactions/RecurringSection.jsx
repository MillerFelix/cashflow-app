import React, { useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

function RecurringSection({ transactions, onConfirmValue }) {
  // Filtra apenas as fixas (recorrentes) do mês
  const recurringItems = transactions
    .filter((t) => t.isFixed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (recurringItems.length === 0) return null;

  // Estado local para edição rápida
  const [editingId, setEditingId] = useState(null);
  const [rawValue, setRawValue] = useState(""); // Armazena apenas números (string)

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  const isDatePassedOrToday = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr <= today;
  };

  // Começa a edição: Pega o valor atual (ex: 100.50) e transforma em "10050" para a máscara
  const startEditing = (t) => {
    setEditingId(t.id);
    setRawValue((t.value * 100).toFixed(0));
  };

  // Formata o visual enquanto digita (Ex: "10050" -> "R$ 100,50")
  const getFormattedDisplay = (val) => {
    if (!val) return "R$ 0,00";
    const number = parseInt(val) / 100;
    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleInputChange = (e) => {
    // Remove tudo que não é dígito
    const val = e.target.value.replace(/\D/g, "");
    setRawValue(val);
  };

  const handleConfirm = (id) => {
    const finalValue = parseInt(rawValue || "0") / 100;
    if (!isNaN(finalValue) && finalValue > 0) {
      onConfirmValue(id, finalValue);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setRawValue("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden mb-8">
      <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
        <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
          <FaClock className="text-indigo-500" /> Transações Recorrentes
        </h3>
        <span className="text-xs font-bold bg-white text-indigo-600 px-3 py-1 rounded-full border border-indigo-200">
          {recurringItems.length}
        </span>
      </div>

      <div className="divide-y divide-gray-50">
        {recurringItems.map((t) => {
          const needsConfirmation =
            !t.isConfirmed && isDatePassedOrToday(t.date);

          return (
            <div
              key={t.id}
              className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${needsConfirmation ? "bg-orange-50/60" : "hover:bg-gray-50"}`}
            >
              {/* Esquerda: Informações */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm shrink-0
                  ${t.isConfirmed ? "bg-green-100 text-green-600" : needsConfirmation ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {t.isConfirmed ? <FaCheckCircle /> : <FaClock />}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-base">
                    {t.description}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Vencimento: {formatDate(t.date)} • {t.category}
                  </p>
                </div>
              </div>

              {/* Direita: Ação e Valor */}
              <div className="flex items-center gap-4 self-end sm:self-auto w-full sm:w-auto justify-end">
                {/* MODO EDIÇÃO: Input Grande e Bonito */}
                {editingId === t.id ? (
                  <div className="flex items-center gap-2 animate-fadeIn bg-white p-1.5 rounded-xl shadow-lg border border-indigo-100 ring-4 ring-indigo-50">
                    <input
                      autoFocus
                      type="text"
                      value={getFormattedDisplay(rawValue)}
                      onChange={handleInputChange}
                      className="w-32 sm:w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-gray-800 text-right focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleConfirm(t.id)}
                        className="p-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                        title="Confirmar"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Cancelar"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // MODO VISUALIZAÇÃO
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${needsConfirmation ? "text-orange-700" : t.type === "credit" ? "text-green-700" : "text-gray-900"}`}
                    >
                      {formatCurrency(t.value)}
                    </p>
                    {needsConfirmation ? (
                      <button
                        onClick={() => startEditing(t)}
                        className="text-xs font-bold text-orange-600 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-end gap-1.5 ml-auto mt-1"
                      >
                        <FaEdit /> Confirmar valor?
                      </button>
                    ) : (
                      !t.isConfirmed && (
                        <p className="text-xs text-gray-400 italic">
                          Valor estimado
                        </p>
                      )
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
