import React, { useState, useMemo, useCallback } from "react";
import Button from "../components/common/Button";
import TransactionItem from "../components/transactions/TransactionItem";
import TransactionModal from "../components/transactions/TransactionModal";
import Loader from "../components/common/Loader";
import Filters from "../components/transactions/Filters";
import StatusMessage from "../components/common/StatusMessage";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import {
  expenseCategories,
  incomeCategories,
} from "../components/category/CategoryList";
import ConfirmationModal from "../components/common/ConfirmationModal";
import NoData from "../components/common/NoData";
import { generateMonthlyReportPDF } from "../utils/pdfGenerator";
import { FaFilePdf } from "react-icons/fa";

const buttonStyles = {
  credit: { bgColor: "bg-green-600", hoverColor: "hover:bg-green-700" },
  debit: { bgColor: "bg-red-500", hoverColor: "hover:bg-red-800" },
};

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
  } = useTransactions(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [modalData, setModalData] = useState(null);

  const [filters, setFilters] = useState({
    month: getCurrentMonthYear(),
    type: "",
    category: "",
  });

  const [modalConfirmOpen, setModalConfirmOpen] = useState({
    open: false,
    id: null,
  });
  const [loadingRemove, setLoadingRemove] = useState(false);

  // Apenas delega a criação/edição para o Hook.
  const handleSaveTransaction = useCallback(
    async (data) => {
      const { id, type, description, value, date, category, isFixed } = data;

      if (id) {
        await editTransaction(id, { type, description, value, date, category });
      } else {
        await addTransaction(type, description, value, date, category, isFixed);
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

  const confirmRemoveTransaction = useCallback((id) => {
    setModalConfirmOpen({ open: true, id });
  }, []);

  const handleEditClick = useCallback((transaction) => {
    setModalData(transaction);
    setModalType(transaction.type);
    setIsModalOpen(true);
  }, []);

  const handleDuplicateClick = useCallback((transaction) => {
    setModalData({ ...transaction, id: null });
    setModalType(transaction.type);
    setIsModalOpen(true);
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ month: getCurrentMonthYear(), type: "", category: "" });
    setCategory("");
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchMonth =
        !filters.month || transaction.date.startsWith(filters.month);
      const matchType = !filters.type || transaction.type === filters.type;
      const matchCategory =
        !filters.category ||
        transaction.category
          .toLowerCase()
          .includes(filters.category.toLowerCase());
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

  return (
    <div className="flex justify-center mt-4 mb-10">
      <div className="m-4 p-4 sm:m-6 sm:p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
          Transações Financeiras
        </h1>
        <p className="text-gray-600 mt-2 text-center text-sm sm:text-base">
          Consulte o seu histórico, faça edições rápidas ou duplique gastos
          recorrentes.
        </p>

        <div className="flex justify-center gap-8 my-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase font-bold">
              Entradas
            </p>
            <p className="text-green-600 font-bold text-lg">
              {totalIncomes.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase font-bold">Saídas</p>
            <p className="text-red-500 font-bold text-lg">
              {totalExpenses.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-center mb-6">
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm
              ${
                filteredTransactions.length === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-900 active:scale-95"
              }`}
          >
            <FaFilePdf />
            Exportar Relatório Mensal
          </button>
        </div>

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

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4 w-full mt-2">
          <Button
            onClick={() => {
              setModalData(null);
              setModalType("credit");
              setIsModalOpen(true);
            }}
            {...buttonStyles.credit}
            className="text-gray-200 w-full sm:w-auto shadow-md"
          >
            Adicionar Receita
          </Button>
          <Button
            onClick={() => {
              setModalData(null);
              setModalType("debit");
              setIsModalOpen(true);
            }}
            {...buttonStyles.debit}
            className="text-gray-200 w-full sm:w-auto shadow-md"
          >
            Adicionar Despesa
          </Button>
        </div>

        {loading && <Loader />}
        {loadingRemove && <Loader />}

        {filteredTransactions.length === 0 && !loading && (
          <NoData message="Nenhuma transação encontrada para este mês ou filtro." />
        )}

        {filteredTransactions.length > 0 && (
          <TransactionItem
            transactions={filteredTransactions}
            removeTransaction={confirmRemoveTransaction}
            onEdit={handleEditClick}
            onDuplicate={handleDuplicateClick}
          />
        )}

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

        {modalConfirmOpen.open && (
          <ConfirmationModal
            showModal={modalConfirmOpen.open}
            title="Confirmar Exclusão"
            description="Tem certeza que deseja remover esta transação de forma permanente?"
            onConfirm={() => {
              handleRemoveTransaction(modalConfirmOpen.id);
              setModalConfirmOpen({ open: false, id: null });
            }}
            onCancel={() => setModalConfirmOpen({ open: false, id: null })}
            confirmText="Excluir"
            cancelText="Cancelar"
          />
        )}
      </div>
    </div>
  );
}

export default Transactions;
