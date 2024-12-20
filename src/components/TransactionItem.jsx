/* eslint-disable react/prop-types */
function TransactionItem({ transactions, onTransaction }) {
  function removeTransaction(id) {
    onTransaction(transactions.filter((transaction) => transaction.id !== id));
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className={`p-4 rounded-lg shadow-md ${
            transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">
                {transaction.description}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <p
                className={`font-semibold ${
                  transaction.type === "credit"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {transaction.type === "credit" ? "+" : "-"} R$
                {transaction.amount}
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => removeTransaction(transaction.id)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
/* eslint-enable react/prop-types */

export default TransactionItem;
