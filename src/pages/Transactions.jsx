import { useState } from "react";
import Button from "../components/Button";
import TransactionItem from "../components/TransactionItem";
import TransactionModal from "../components/TransactionModal";
import Loader from "../components/Loader";
import Filters from "../components/Filters";
import StatusMessage from "../components/StatusMessage";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  expenseCategories,
  incomeCategories,
} from "../components/CategoryList";

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

  // Função para buscar o saldo atual (sem atualizações ao remover)
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

    // Calcula o novo saldo baseado no tipo de transação (crédito ou débito)
    const newBalance =
      type === "credit"
        ? currentBalance + transactionAmount
        : currentBalance - transactionAmount;

    // Atualiza o saldo no Firestore
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
    await updateBalance(amount, type); // Atualiza o saldo após a transação ser adicionada
  };

  const handleRemoveTransaction = async (id) => {
    // Só removemos a transação depois da confirmação do modal
    await removeTransaction(id);
    // **Não atualizamos o saldo aqui**, pois a remoção não deve afetá-lo
  };

  const confirmRemoveTransaction = (id) => {
    setModalConfirmOpen({
      open: true,
      id: id,
    });
  };

  return (
    <div className="m-8 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-gray-800 text-2xl font-semibold text-center mb-4">
        Transações Financeiras
      </h2>

      <Filters
        filters={filters}
        handleFilterChange={(e) => {
          const { name, value } = e.target;
          setFilters({ ...filters, [name]: value });
        }}
        clearFilters={() => setFilters({ date: "", type: "", category: "" })}
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
        transactions={transactions.filter((transaction) => {
          return (
            (!filters.date || transaction.date === filters.date) &&
            (!filters.type || transaction.type === filters.type) &&
            (!filters.category ||
              transaction.category
                .toLowerCase()
                .includes(filters.category.toLowerCase()))
          );
        })}
        removeTransaction={(id) => {
          // Inicia a remoção, passando o ID da transação para o modal de confirmação
          confirmRemoveTransaction(id);
        }}
      />

      {isModalOpen && (
        <TransactionModal
          type={modalType}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTransaction}
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
                  handleRemoveTransaction(modalConfirmOpen.id);
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
