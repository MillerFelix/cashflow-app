import React, { useState, useMemo, useCallback } from "react";
import Button from "../components/common/Button";
import TransactionItem from "../components/transactions/TransactionItem";
import TransactionModal from "../components/transactions/TransactionModal";
import Loader from "../components/common/Loader";
import Filters from "../components/transactions/Filters";
import StatusMessage from "../components/common/StatusMessage";
import RecurringSection from "../components/transactions/RecurringSection";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import {
  expenseCategories,
  incomeCategories,
} from "../components/category/CategoryList";
import ConfirmationModal from "../components/common/ConfirmationModal";
import NoData from "../components/common/NoData";
import { generateMonthlyReportPDF } from "../utils/pdfGenerator";
import {
  FaFilePdf,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

const getCurrentMonthYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

function Transactions() {
  const user = useAuth();
  const userId = user?.uid;
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [category, setCategory] = useState("");

  const {
    transactions,
    loading,
    message,
    addTransaction,
    removeTransaction,
    editTransaction,
    confirmTransactionValue,
    cancelFutureFixedTransactions,
  } = useTransactions(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [modalData, setModalData] = useState(null);

  const [filters, setFilters] = useState({
    month: getCurrentMonthYear(),
    type: "",
    category: "",
  });

  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [loadingRemove, setLoadingRemove] = useState(false);

  // --- CORREÇÃO AQUI ---
  const handleSaveTransaction = useCallback(
    async (data) => {
      // Agora passamos o objeto inteiro 'data' que contém { ... , paymentMethod }
      if (data.id) {
        // Para edição, também passamos tudo
        await editTransaction(data.id, data);
      } else {
        // Para criação, passamos o objeto direto
        await addTransaction(data);
      }
    },
    [editTransaction, addTransaction],
  );

  const handleRemoveTransaction = useCallback(
    async (id) => {
      setLoadingRemove(true);
      await removeTransaction(id);
      setLoadingRemove(false);
    },
    [removeTransaction],
  );

  const confirmRemoveTransaction = useCallback(
    (id) => {
      const t = transactions.find((tx) => tx.id === id);
      setTransactionToDelete(t);
    },
    [transactions],
  );

  const handleEditClick = useCallback((transaction) => {
    setModalData(transaction);
    setModalType(transaction.type);
    setIsModalOpen(true);
  }, []);

  const handleDuplicateClick = useCallback((transaction) => {
    setModalData({ ...transaction, id: null, isFixed: false });
    setModalType(transaction.type);
    setIsModalOpen(true);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ month: getCurrentMonthYear(), type: "", category: "" });
    setCategory("");
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchMonth = !filters.month || t.date.startsWith(filters.month);
      const matchType = !filters.type || t.type === filters.type;
      const matchCategory =
        !filters.category ||
        t.category.toLowerCase().includes(filters.category.toLowerCase());
      return matchMonth && matchType && matchCategory;
    });
  }, [transactions, filters]);

  const { totalIncomes, totalExpenses } = useMemo(() => {
    let inc = 0,
      exp = 0;
    filteredTransactions.forEach((t) => {
      if (t.type === "credit") inc += t.value;
      if (t.type === "debit") exp += t.value;
    });
    return { totalIncomes: inc, totalExpenses: exp };
  }, [filteredTransactions]);

  const displayMonth = useMemo(() => {
    if (!filters.month) return "Todo o Período";
    const [year, month] = filters.month.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }, [filters.month]);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans text-gray-800 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* CABEÇALHO */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 capitalize">
                {displayMonth}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Gestão completa de entradas e saídas.
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto shadow-sm p-1 bg-white rounded-2xl border border-gray-100">
              <button
                onClick={() => {
                  setModalData(null);
                  setModalType("credit");
                  setIsModalOpen(true);
                }}
                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex justify-center items-center gap-2 shadow-green-200 shadow-md"
              >
                <FaPlus size={12} className="text-white" /> Nova Receita
              </button>
              <button
                onClick={() => {
                  setModalData(null);
                  setModalType("debit");
                  setIsModalOpen(true);
                }}
                className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex justify-center items-center gap-2 shadow-red-200 shadow-md"
              >
                <FaMinus size={12} className="text-white" /> Nova Despesa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-green-200 transition-colors">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Entradas
                </p>
                <p className="text-2xl font-black text-green-600 group-hover:scale-105 transition-transform origin-left">
                  {totalIncomes.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-full text-green-600 group-hover:bg-green-100 transition-colors">
                <FaArrowUp />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-red-200 transition-colors">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Saídas
                </p>
                <p className="text-2xl font-black text-red-600 group-hover:scale-105 transition-transform origin-left">
                  {totalExpenses.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-full text-red-600 group-hover:bg-red-100 transition-colors">
                <FaArrowDown />
              </div>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
            <div className="w-full">
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
            </div>

            <button
              onClick={() =>
                generateMonthlyReportPDF(
                  filteredTransactions,
                  filters.month,
                  totalIncomes,
                  totalExpenses,
                )
              }
              disabled={filteredTransactions.length === 0}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all
                ${
                  filteredTransactions.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
            >
              <FaFilePdf /> Relatório
            </button>
          </div>
        </div>

        <StatusMessage message={message} />

        {/* LISTA */}
        {loading && (
          <div className="py-10">
            <Loader />
          </div>
        )}
        {loadingRemove && (
          <div className="py-10">
            <Loader />
          </div>
        )}

        {!loading && filteredTransactions.length > 0 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <RecurringSection
              transactions={filteredTransactions}
              onConfirmValue={confirmTransactionValue}
            />

            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4 flex items-center gap-2 px-1">
                Extrato Detalhado{" "}
                <span className="text-gray-400 text-sm font-normal">
                  ({filteredTransactions.length})
                </span>
              </h3>
              <TransactionItem
                transactions={filteredTransactions}
                removeTransaction={confirmRemoveTransaction}
                onEdit={handleEditClick}
                onDuplicate={handleDuplicateClick}
              />
            </div>
          </div>
        )}

        {/* MODAIS */}
        {isModalOpen && (
          <TransactionModal
            type={modalType}
            initialData={modalData}
            onClose={() => {
              setIsModalOpen(false);
              setModalData(null);
            }}
            onSave={handleSaveTransaction}
          />
        )}

        {transactionToDelete && !transactionToDelete.isFixed && (
          <ConfirmationModal
            showModal={!!transactionToDelete}
            title="Excluir Transação"
            description="Tem certeza que deseja apagar este item?"
            onConfirm={() => {
              handleRemoveTransaction(transactionToDelete.id);
              setTransactionToDelete(null);
            }}
            onCancel={() => setTransactionToDelete(null)}
            confirmText="Excluir"
            cancelText="Cancelar"
          />
        )}

        {transactionToDelete && transactionToDelete.isFixed && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
              <div className="flex items-center gap-3 mb-4 text-blue-600">
                <div className="bg-blue-50 p-3 rounded-full">
                  <FaSyncAlt size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Gerir Assinatura
                </h3>
              </div>
              <p className="text-gray-600 mb-6 font-medium">
                A conta <strong>"{transactionToDelete.description}"</strong> é
                recorrente. Como quer proceder?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleRemoveTransaction(transactionToDelete.id);
                    setTransactionToDelete(null);
                  }}
                  className="w-full py-3 bg-gray-50 text-gray-800 font-bold rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors"
                >
                  Apagar só deste mês
                </button>
                <button
                  onClick={async () => {
                    setLoadingRemove(true);
                    await cancelFutureFixedTransactions(transactionToDelete);
                    setLoadingRemove(false);
                    setTransactionToDelete(null);
                  }}
                  className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-md"
                >
                  Cancelar Assinatura (Tudo)
                </button>
                <button
                  onClick={() => setTransactionToDelete(null)}
                  className="w-full py-2 text-gray-400 font-bold hover:text-gray-600"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;
