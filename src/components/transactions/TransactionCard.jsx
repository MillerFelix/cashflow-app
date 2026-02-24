import React from "react";
import {
  FaEdit,
  FaTrash,
  FaCopy,
  FaSyncAlt,
  FaClock,
  FaCreditCard,
  FaMoneyBillWave,
  FaQrcode,
  FaRegCreditCard,
} from "react-icons/fa";

function TransactionCard({ transaction, onRemove, onEdit, onDuplicate }) {
  const isCredit = transaction.type === "credit";

  // Cores de fundo suaves
  const cardStyle = isCredit
    ? "bg-green-50 border-green-100 hover:bg-green-100/50"
    : "bg-red-50 border-red-100 hover:bg-red-100/50";

  const valueColor = isCredit ? "text-green-700" : "text-red-700";
  const sign = isCredit ? "+" : "-";

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(transaction.value);

  const [year, month, day] = transaction.date.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  const today = new Date().toISOString().split("T")[0];
  const isFuture = transaction.date > today;

  // Lógica para escolher o ícone do método de pagamento
  const getPaymentIcon = (method) => {
    switch (method) {
      case "credit":
        return <FaCreditCard className="text-purple-600" />;
      case "debit":
        return <FaRegCreditCard className="text-blue-600" />;
      case "money":
        return <FaMoneyBillWave className="text-green-600" />;
      case "pix":
        return <FaQrcode className="text-teal-600" />;
      default:
        return null;
    }
  };

  const getPaymentLabel = (method) => {
    switch (method) {
      case "credit":
        return "Crédito";
      case "debit":
        return "Débito";
      case "money":
        return "Dinheiro";
      case "pix":
        return "Pix";
      default:
        return null;
    }
  };

  return (
    <div
      className={`group p-5 rounded-2xl shadow-sm border transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden ${cardStyle}`}
    >
      {/* Barra lateral colorida */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${isCredit ? "bg-green-500" : "bg-red-500"}`}
      ></div>

      <div className="flex-1 pl-3">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h4 className="font-bold text-gray-900 text-base leading-snug">
            {transaction.description}
          </h4>

          {/* Badge: Fixa / Recorrente */}
          {transaction.isFixed && (
            <span className="flex items-center gap-1 bg-white text-blue-600 border border-blue-100 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-sm">
              <FaSyncAlt size={9} /> Fixa
            </span>
          )}

          {/* Badge: Futura / Agendada */}
          {isFuture && (
            <span className="flex items-center gap-1 bg-white text-orange-600 border border-orange-100 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shadow-sm">
              <FaClock size={9} /> Agendado
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-gray-500 flex-wrap">
          {/* Categoria */}
          <span className="bg-white/60 px-2 py-1 rounded-md text-gray-600 border border-gray-200/50">
            {transaction.category}
          </span>

          {/* Ícone e Nome do Método de Pagamento (Só aparece se tiver sido salvo) */}
          {transaction.paymentMethod &&
            getPaymentLabel(transaction.paymentMethod) && (
              <div
                className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-md border border-gray-200/50 shadow-sm"
                title={`Pago via ${getPaymentLabel(transaction.paymentMethod)}`}
              >
                {getPaymentIcon(transaction.paymentMethod)}
                <span className="text-gray-700 font-semibold">
                  {getPaymentLabel(transaction.paymentMethod)}
                </span>
              </div>
            )}

          <span className="opacity-40 hidden sm:inline">•</span>

          {/* Data (Laranja se for futura) */}
          <span className={isFuture ? "text-orange-700 font-bold" : ""}>
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-6 pl-3 sm:pl-0">
        <span className={`font-extrabold text-lg tracking-tight ${valueColor}`}>
          {sign} {formattedValue}
        </span>

        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onDuplicate(transaction)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
            title="Duplicar"
          >
            <FaCopy size={14} />
          </button>
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-white rounded-lg transition-colors"
            title="Editar"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => onRemove(transaction.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
            title="Excluir"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TransactionCard);
