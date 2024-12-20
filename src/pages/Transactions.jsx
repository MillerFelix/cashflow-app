import { useState } from "react";
import { FaRedoAlt } from "react-icons/fa";
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
      category: "Salary",
    },
    {
      id: 2,
      type: "debit",
      description: "Bill Payment",
      amount: 150,
      date: "2024-12-18",
      category: "Utilities",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [filters, setFilters] = useState({
    date: "",
    type: "",
    category: "",
  });

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

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  }

  function clearFilters() {
    setFilters({ date: "", type: "", category: "" });
  }

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      (!filters.date || transaction.date === filters.date) &&
      (!filters.type || transaction.type === filters.type) &&
      (!filters.category ||
        transaction.category
          .toLowerCase()
          .includes(filters.category.toLowerCase()))
    );
  });

  return (
    <div className="m-8 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-gray-800 text-2xl font-semibold text-center mb-4">
        Transações Financeiras
      </h2>

      {/* Filtros */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-wrap gap-7 items-center justify-center">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
          >
            <option value="">Todos</option>
            <option value="credit">Entrada</option>
            <option value="debit">Saída</option>
          </select>
          <input
            type="text"
            name="category"
            placeholder="Categoria"
            value={filters.category}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
          />
          <button
            onClick={clearFilters}
            className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            <FaRedoAlt />
          </button>
        </div>
      </div>

      {/* Botões de Adição */}
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

      {/* Lista de Transações */}
      <TransactionItem
        transactions={filteredTransactions}
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
