import { useState } from "react";

function Transactions() {
  // Posteriormente será consultado do firestore
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "credit",
      description: "Bank Deposit",
      amount: 500,
      date: "2024-12-19",
    },
    {
      id: 2,
      type: "debit",
      description: "Bill Payment",
      amount: 150,
      date: "2024-12-18",
    },
    {
      id: 2,
      type: "debit",
      description: "Bill Payment",
      amount: 150,
      date: "2024-12-18",
    },
    {
      id: 2,
      type: "debit",
      description: "Bill Payment",
      amount: 150,
      date: "2024-12-18",
    },
  ]);

  // Adicionar transação
  function addTransaction(type, description, amount) {
    const newTransaction = {
      id: transactions.length + 1,
      type,
      description,
      amount,
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([...transactions, newTransaction]);
  }

  // Remover transação
  function removeTransaction(id) {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  }

  return (
    <div className="m-8 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Transações Financeiras
      </h2>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => addTransaction("credit", "New Deposit", 100)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
        >
          Adicionar Crédito
        </button>
        <button
          onClick={() => addTransaction("debit", "New Payment", 50)}
          className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
        >
          Adicionar Débito
        </button>
      </div>

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
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <div>
                <p
                  className={`font-semibold ${
                    transaction.type === "credit"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"} $
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
    </div>
  );
}

export default Transactions;
