import { useState } from "react";
import Button from "../components/common/Button";
import TransactionItem from "../components/transactions/TransactionItem";
import TransactionModal from "../components/transactions/TransactionModal";
import Loader from "../components/common/Loader";
import Filters from "../components/transactions/Filters";
import StatusMessage from "../components/common/StatusMessage";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  expenseCategories,
  incomeCategories,
} from "../components/category/CategoryList";
import ConfirmationModal from "../components/common/ConfirmationModal";

const buttonStyles = {
  credit: { bgColor: "bg-green-600", hoverColor: "hover:bg-green-700" },
  debit: { bgColor: "bg-red-500", hoverColor: "hover:bg-red-800" },
};

function Transactions() {
  const userId = useAuth();
  const { transactions, loading, message, addTransaction, removeTransaction } =
    useTransactions(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [filters, setFilters] = useState({ date: "", type: "", category: "" });
  const [modalConfirmOpen, setModalConfirmOpen] = useState({
    open: false,
    id: null,
  });

  // Função para buscar o saldo atual
  const fetchBalance = async () => {
    if (!userId) return 0;
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.exists() ? userSnapshot.data().balance || 0 : 0;
  };

  // Atualiza o saldo com a transação
  const updateBalance = async (transactionAmount, type) => {
    if (!userId) return;

    const currentBalance = await fetchBalance();
    const newBalance =
      type === "credit"
        ? currentBalance + transactionAmount
        : currentBalance - transactionAmount;

    const userDoc = doc(db, "users", userId);
    await setDoc(userDoc, { balance: newBalance }, { merge: true });
  };

  const handleAddTransaction = async (
    type,
    description,
    amount,
    date,
    category
  ) => {
    await addTransaction(type, description, amount, date, category);
    await updateBalance(amount, type); // Atualiza o saldo após a transação
  };

  const handleRemoveTransaction = async (id) => {
    await removeTransaction(id);
  };

  const confirmRemoveTransaction = (id) => {
    setModalConfirmOpen({ open: true, id });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ date: "", type: "", category: "" });
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
          {...buttonStyles.credit}
          className="text-gray-200"
        >
          Adicionar Crédito
        </Button>
        <Button
          onClick={() => {
            setModalType("debit");
            setIsModalOpen(true);
          }}
          {...buttonStyles.debit}
          className="text-gray-200"
        >
          Adicionar Débito
        </Button>
      </div>

      {loading && <Loader />}

      <TransactionItem
        transactions={filteredTransactions}
        removeTransaction={confirmRemoveTransaction}
      />

      {isModalOpen && (
        <TransactionModal
          type={modalType}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTransaction}
        />
      )}

      {modalConfirmOpen.open && (
        <ConfirmationModal
          showModal={modalConfirmOpen.open}
          title="Confirmar Exclusão"
          description="Tem certeza que deseja remover esta transação?"
          onConfirm={() => {
            handleRemoveTransaction(modalConfirmOpen.id);
            setModalConfirmOpen({ open: false, id: null });
          }}
          onCancel={() => setModalConfirmOpen({ open: false, id: null })}
          confirmText="Confirmar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
}

export default Transactions;
