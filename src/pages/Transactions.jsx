import React, { useState, useMemo, useCallback } from "react";
import TransactionItem from "../components/transactions/TransactionItem";
import TransactionModal from "../components/transactions/TransactionModal";
import Loader from "../components/common/Loader";
import Filters from "../components/transactions/Filters";
import StatusMessage from "../components/common/StatusMessage";
import RecurringSection from "../components/transactions/RecurringSection";
import TransactionSummary from "../components/transactions/TransactionSummary";
import ManageFixedTransactionModal from "../components/transactions/ManageFixedTransactionModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import {
  expenseCategories,
  incomeCategories,
} from "../components/category/CategoryList";
import { generateMonthlyReportPDF } from "../utils/pdfGenerator";
import { FaFilePdf, FaPlus, FaMinus, FaExchangeAlt } from "react-icons/fa";

const getCurrentMonthYear = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

function Transactions() {
  const user = useAuth();
  const userId = user?.uid;

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

  // States de UI e Filtros
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [category, setCategory] = useState("");
  const [filters, setFilters] = useState({
    month: getCurrentMonthYear(),
    type: "",
    category: "",
  });

  // States de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [modalData, setModalData] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [loadingRemove, setLoadingRemove] = useState(false);

  // --- HANDLERS ---
  const handleSaveTransaction = useCallback(
    async (data) => {
      if (data.id) {
        await editTransaction(data.id, data);
      } else {
        await addTransaction(data);
      }
    },
    [editTransaction, addTransaction],
  );

  const handleRemoveSingle = useCallback(
    async (id) => {
      setLoadingRemove(true);
      await removeTransaction(id);
      setLoadingRemove(false);
      setTransactionToDelete(null);
    },
    [removeTransaction],
  );

  const handleRemoveAllFixed = useCallback(
    async (transaction) => {
      setLoadingRemove(true);
      await cancelFutureFixedTransactions(transaction);
      setLoadingRemove(false);
      setTransactionToDelete(null);
    },
    [cancelFutureFixedTransactions],
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

  // --- CÁLCULOS (MEMOIZADOS) ---
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
    return filteredTransactions.reduce(
      (acc, t) => {
        if (t.type === "credit") acc.totalIncomes += t.value;
        if (t.type === "debit") acc.totalExpenses += t.value;
        return acc;
      },
      { totalIncomes: 0, totalExpenses: 0 },
    );
  }, [filteredTransactions]);

  const displayMonth = useMemo(() => {
    if (!filters.month) return "Todo o Período";
    const [year, month] = filters.month.split("-");
    return new Date(year, month - 1).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
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
                <FaPlus size={12} /> Nova Receita
              </button>
              <button
                onClick={() => {
                  setModalData(null);
                  setModalType("debit");
                  setIsModalOpen(true);
                }}
                className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 flex justify-center items-center gap-2 shadow-red-200 shadow-md"
              >
                <FaMinus size={12} /> Nova Despesa
              </button>
            </div>
          </div>

          <TransactionSummary
            totalIncomes={totalIncomes}
            totalExpenses={totalExpenses}
          />
        </div>

        {/* FILTROS E RELATÓRIO */}
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
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${filteredTransactions.length === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black"}`}
            >
              <FaFilePdf /> Relatório
            </button>
          </div>
        </div>

        <StatusMessage message={message} />

        {/* ESTADOS DE CARREGAMENTO E VAZIO */}
        {loading || loadingRemove ? (
          <div className="py-10">
            <Loader />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-4 animate-fadeIn">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <FaExchangeAlt className="text-5xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhuma transação encontrada
            </h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Não encontramos nenhum registro financeiro para o período e os
              filtros selecionados.
            </p>
            <button
              onClick={clearFilters}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors active:scale-95"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
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

        {/* MODAIS COMPONENTIZADOS */}
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

        <ConfirmationModal
          showModal={!!transactionToDelete && !transactionToDelete.isFixed}
          title="Excluir Transação"
          description="Tem certeza que deseja apagar este item?"
          onConfirm={() => handleRemoveSingle(transactionToDelete.id)}
          onCancel={() => setTransactionToDelete(null)}
          confirmText="Excluir"
        />

        <ManageFixedTransactionModal
          transaction={
            transactionToDelete?.isFixed ? transactionToDelete : null
          }
          onClose={() => setTransactionToDelete(null)}
          onDeleteSingle={handleRemoveSingle}
          onDeleteAll={handleRemoveAllFixed}
          loading={loadingRemove}
        />
      </div>
    </div>
  );
}

export default Transactions;
