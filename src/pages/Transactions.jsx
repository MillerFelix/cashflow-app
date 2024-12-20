import { useState } from "react";
import Button from "../components/Button";
import TransactionItem from "../components/TransactionItem";
import TransactionModal from "../components/TransactionModal";

function Transactions() {
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
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");

  function addTransaction(type, description, amount, date, category) {
    const newTransaction = {
      id: transactions.length + 1,
      type,
      description,
      amount,
      date,
      category,
    };
    setTransactions([...transactions, newTransaction]);
  }

  return (
    <div className="m-8 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-1">
        Transações Financeiras
      </h2>

      <div className="flex justify-between mb-4">
        <Button
          onClick={() => {
            setModalType("credit");
            setIsModalOpen(true);
          }}
          bgColor="bg-green-600"
          hoverColor="hover:bg-green-700"
          className="text-gray-200"
        >
          Adicionar Crédito
        </Button>
        <Button
          onClick={() => {
            setModalType("debit");
            setIsModalOpen(true);
          }}
          bgColor="bg-red-500"
          hoverColor="hover:bg-red-800"
          className="text-gray-200"
        >
          Adicionar Débito
        </Button>
      </div>

      <TransactionItem
        transactions={transactions}
        onTransaction={setTransactions}
      />

      {isModalOpen && (
        <TransactionModal
          type={modalType}
          onClose={() => setIsModalOpen(false)}
          onSave={addTransaction}
        />
      )}
    </div>
  );
}

export default Transactions;
