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
import NoData from "../components/common/NoData";

// Estilos dos botões
const buttonStyles = {
  credit: { bgColor: "bg-green-600", hoverColor: "hover:bg-green-700" },
  debit: { bgColor: "bg-red-500", hoverColor: "hover:bg-red-800" },
};

function Transactions() {
  const user = useAuth();
  const userId = user?.uid;
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [category, setCategory] = useState("");
  const { transactions, loading, message, addTransaction, removeTransaction } =
    useTransactions(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [filters, setFilters] = useState({ date: "", type: "", category: "" });
  const [modalConfirmOpen, setModalConfirmOpen] = useState({
    open: false,
    id: null,
  });
  const [loadingRemove, setLoadingRemove] = useState(false); // Novo estado para controle de remoção

  // Função para buscar o saldo atual
  async function fetchBalance() {
    if (!userId) return 0;
    const userDoc = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.exists() ? userSnapshot.data().balance || 0 : 0;
  }

  // Atualiza o saldo com a transação
  async function updateBalance(transactionValue, type) {
    if (!userId) return;

    const currentBalance = await fetchBalance();
    const newBalance =
      type === "credit"
        ? currentBalance + transactionValue
        : currentBalance - transactionValue;

    const userDoc = doc(db, "users", userId);
    await setDoc(userDoc, { balance: newBalance }, { merge: true });
  }

  // Função para adicionar transação
  async function handleAddTransaction(
    type,
    description,
    value,
    date,
    category
  ) {
    await addTransaction(type, description, value, date, category);
    await updateBalance(value, type);
  }

  // Função para remover transação
  async function handleRemoveTransaction(id) {
    setLoadingRemove(true); // Inicia o carregamento
    await removeTransaction(id);
    setLoadingRemove(false); // Finaliza o carregamento
  }

  // Função para confirmar remoção
  function confirmRemoveTransaction(id) {
    setModalConfirmOpen({ open: true, id });
  }

  // Função para alterar filtros
  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  }

  // Função para limpar filtros
  function clearFilters() {
    setFilters({ date: "", type: "", category: "" });
  }

  // Filtra transações com base nos filtros aplicados
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
    <div className="flex justify-center mt-4">
      <div className="m-4 p-4 sm:m-6 sm:p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
          Transações Financeiras
        </h1>
        <p className="text-gray-600 mt-2 text-center text-sm sm:text-base">
          Registre e visualize suas transações para um melhor controle
          financeiro.
        </p>

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

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4 w-full">
          <Button
            onClick={() => {
              setModalType("credit");
              setIsModalOpen(true);
            }}
            {...buttonStyles.credit}
            className="text-gray-200 w-full sm:w-auto"
          >
            Adicionar Crédito
          </Button>
          <Button
            onClick={() => {
              setModalType("debit");
              setIsModalOpen(true);
            }}
            {...buttonStyles.debit}
            className="text-gray-200 w-full sm:w-auto"
          >
            Adicionar Débito
          </Button>
        </div>

        {loading && <Loader />}
        {loadingRemove && <Loader />}

        {filteredTransactions.length === 0 && !loading && (
          <NoData message="Nenhuma transação encontrada." />
        )}

        {filteredTransactions.length > 0 && (
          <TransactionItem
            transactions={filteredTransactions}
            removeTransaction={confirmRemoveTransaction}
          />
        )}

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
    </div>
  );
}

export default Transactions;
