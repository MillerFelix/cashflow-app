import { FaClock, FaCoins } from "react-icons/fa";
import { expenseCategories, incomeCategories } from "../category/CategoryList"; // Importando categorias

function TransactionCard({ transaction, onRemove }) {
  const isCredit = transaction.type === "credit";
  const transactionDate = new Date(transaction.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isFutureTransaction = transactionDate > today;

  // Cores ajustadas para manter identidade visual
  const bgColor = isFutureTransaction
    ? isCredit
      ? "bg-green-500 text-white" // Futuro crédito
      : "bg-red-500 text-white" // Futuro débito
    : isCredit
    ? "bg-green-200 text-gray-700" // Crédito normal
    : "bg-red-200 text-gray-700"; // Débito normal

  const textColor = isFutureTransaction
    ? "text-white"
    : isCredit
    ? "text-green-700"
    : "text-red-700";
  const removeBtnColor = isFutureTransaction
    ? "text-gray-300 hover:text-white"
    : "text-red-500 hover:text-red-700";

  // Pegando o ícone da categoria
  const categoryIcon =
    incomeCategories.find((c) => c.name === transaction.category)?.icon ||
    expenseCategories.find((c) => c.name === transaction.category)?.icon ||
    (transaction.category === "Saldo" ? <FaCoins /> : <FaClock />); // Ícones personalizados

  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-all ${bgColor} hover:shadow-xl`}
    >
      <div className="flex justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          {categoryIcon}
          <h3 className="font-semibold text-base sm:text-lg">
            {transaction.description}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className={textColor}>{isCredit ? "+" : "-"}</span>
          <p className={`font-semibold ${textColor} text-sm sm:text-base`}>
            {parseFloat(transaction.value).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>
      </div>

      <p className="text-xs sm:text-sm">
        {transactionDate.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
      </p>
      {isFutureTransaction && (
        <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm font-semibold italic">
          <FaClock /> Transação Futura
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => onRemove(transaction.id)}
          className={`text-xs sm:text-sm ${removeBtnColor} transition-colors`}
        >
          Remover
        </button>
        <span className="text-xs sm:text-sm italic">
          {transaction.category}
        </span>
      </div>
    </div>
  );
}

export default TransactionCard;
