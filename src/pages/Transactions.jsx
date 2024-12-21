import { useState } from "react";
import Button from "../components/Button";
import TransactionItem from "../components/TransactionItem";
import TransactionModal from "../components/TransactionModal";
import Loader from "../components/Loader";
import Filters from "../components/Filters";
import StatusMessage from "../components/StatusMessage";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import {
  expenseCategories,
  incomeCategories,
} from "../components/CategoryList";

function Transactions() {
  const userId = useAuth(); // Agora retorna apenas o userId (UID)
  const { transactions, loading, message, addTransaction, removeTransaction } =
    useTransactions(userId); // Passando o userId corretamente para o hook

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [filters, setFilters] = useState({ date: "", type: "", category: "" });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [category, setCategory] = useState("");
  const [modalConfirmOpen, setModalConfirmOpen] = useState({
    open: false,
    id: null,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ date: "", type: "" });
    setCategory("");
  };

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

      <Filters
        filters={filters}
        handleFilterChange={handleFilterChange}
        clearFilters={clearFilters}
        showCategoryDropdown={showCategoryDropdown}
        setShowCategoryDropdown={setShowCategoryDropdown}
        category={category}
        setCategory={setCategory}
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
      />

      <StatusMessage message={message} />

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

      {loading && <Loader />}

      <TransactionItem
        transactions={filteredTransactions}
        removeTransaction={(id) => setModalConfirmOpen({ open: true, id })}
      />

      {isModalOpen && (
        <TransactionModal
          type={modalType}
          onClose={() => setIsModalOpen(false)}
          onSave={addTransaction}
        />
      )}

      {modalConfirmOpen.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
            <p className="mb-6">
              Tem certeza que deseja remover esta transação?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  removeTransaction(modalConfirmOpen.id);
                  setModalConfirmOpen({ open: false, id: null });
                }}
                bgColor="bg-red-500"
                hoverColor="hover:bg-red-700"
              >
                Confirmar
              </Button>
              <Button
                onClick={() => setModalConfirmOpen({ open: false, id: null })}
                bgColor="bg-gray-300"
                hoverColor="hover:bg-gray-400"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
