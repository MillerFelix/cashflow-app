import React from "react";
import { FaSyncAlt } from "react-icons/fa";

/**
 * Modal exclusivo para gerenciar a exclusão de transações recorrentes (fixas).
 */
function ManageFixedTransactionModal({
  transaction,
  onClose,
  onDeleteSingle,
  onDeleteAll,
  loading,
}) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md animate-scaleIn">
        <div className="flex items-center gap-3 mb-4 text-blue-600">
          <div className="bg-blue-50 p-3 rounded-full">
            <FaSyncAlt size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Gerir Assinatura</h3>
        </div>
        <p className="text-gray-600 mb-6 font-medium">
          A conta <strong>"{transaction.description}"</strong> é recorrente.
          Como quer proceder?
        </p>
        <div className="space-y-3">
          <button
            onClick={() => onDeleteSingle(transaction.id)}
            disabled={loading}
            className="w-full py-3 bg-gray-50 text-gray-800 font-bold rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors disabled:opacity-50"
          >
            Apagar só deste mês
          </button>
          <button
            onClick={() => onDeleteAll(transaction)}
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? "Cancelando..." : "Cancelar Assinatura (Tudo)"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2 text-gray-400 font-bold hover:text-gray-600 disabled:opacity-50"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ManageFixedTransactionModal);
