import React from "react";
import { FaTrashAlt, FaEdit, FaCopy, FaClock } from "react-icons/fa";
import { expenseCategories, incomeCategories } from "../category/CategoryList";

/**
 * Componente TransactionCard
 * Exibe os detalhes de uma transação com esquema de cores inteligente:
 * - Cores claras para o passado.
 * - Cores mais fortes para o futuro.
 */
function TransactionCard({ transaction, onRemove, onEdit, onDuplicate }) {
  const isCredit = transaction.type === "credit";

  // Verifica se é uma transação futura comparando com a data de hoje
  const today = new Date().toISOString().split("T")[0];
  const isFuture = transaction.date > today;

  const allCategories = [...expenseCategories, ...incomeCategories];
  const categoryDetails = allCategories.find(
    (cat) => cat.name === transaction.category,
  );

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(transaction.value);

  const formattedDate = transaction.date.split("-").reverse().join("/");

  let cardStyles = "";
  let iconStyles = "";
  let valueStyles = "";

  if (isCredit) {
    // É Crédito
    cardStyles = isFuture
      ? "bg-green-100 border-green-300 text-green-900 shadow-md" // Futuro (Mais escuro)
      : "bg-green-50 border-green-200 text-green-800 shadow-sm"; // Passado (Mais claro)
    iconStyles = "bg-green-200 text-green-700";
    valueStyles = "text-green-700";
  } else {
    // É Débito
    cardStyles = isFuture
      ? "bg-red-100 border-red-300 text-red-900 shadow-md" // Futuro (Mais escuro)
      : "bg-red-50 border-red-200 text-red-800 shadow-sm"; // Passado (Mais claro)
    iconStyles = "bg-red-200 text-red-700";
    valueStyles = "text-red-700";
  }

  return (
    <div
      className={`p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border transition-transform hover:scale-[1.01] ${cardStyles}`}
    >
      {/* Informações da Transação */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Ícone da Categoria */}
        <div
          className={`p-3 rounded-full flex items-center justify-center text-xl ${iconStyles}`}
        >
          {categoryDetails ? categoryDetails.icon : isCredit ? "+" : "-"}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{transaction.description}</h3>

            {/* Tag visual elegante para transações futuras */}
            {isFuture && (
              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-white bg-opacity-60">
                <FaClock className="text-xs" /> Futura
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm opacity-80 mt-1">
            <span className="font-semibold">{transaction.category}</span>
            <span>•</span>
            <span>{formattedDate}</span>
            {transaction.isFixed && (
              <>
                <span>•</span>
                <span className="bg-white bg-opacity-60 px-2 py-0.5 rounded-full text-xs font-bold">
                  Fixa
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Valor e Botões de Ação */}
      <div className="flex flex-col sm:items-end w-full sm:w-auto mt-4 sm:mt-0 gap-2">
        <span className={`text-xl font-extrabold ${valueStyles}`}>
          {isCredit ? "+" : "-"} {formattedValue}
        </span>

        {/* Botões de Ação minimalistas que combinam com o fundo */}
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-80 transition-colors"
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDuplicate(transaction)}
            className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-opacity-80 transition-colors"
            title="Duplicar"
          >
            <FaCopy />
          </button>
          <button
            onClick={() => onRemove(transaction.id)}
            className="p-2 bg-white bg-opacity-50 rounded-lg hover:bg-red-200 hover:text-red-600 transition-colors"
            title="Excluir"
          >
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TransactionCard);
