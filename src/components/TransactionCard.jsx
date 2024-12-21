function TransactionCard({ transaction, onRemove }) {
  const isCredit = transaction.type === "credit";

  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-all ${
        isCredit ? "bg-green-100" : "bg-red-100"
      } hover:shadow-xl`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {transaction.description}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(transaction.date).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </p>
        </div>
        <p
          className={`font-semibold ${
            isCredit ? "text-green-700" : "text-red-700"
          }`}
        >
          {isCredit ? "+" : "-"} R$
          {parseFloat(transaction.amount).toFixed(2).replace(".", ",")}
        </p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => onRemove(transaction.id)}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Remover
          </button>
        </div>
        <div className="text-sm text-gray-400">
          <span className="italic">{transaction.category}</span>
        </div>
      </div>
    </div>
  );
}

export default TransactionCard;
