import { useState, useEffect } from "react";
import { FaRedoAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  db,
  auth,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onAuthStateChanged,
  query,
  where,
  getDocs,
} from "../firebase";
import Button from "../components/Button";
import TransactionItem from "../components/TransactionItem";
import TransactionModal from "../components/TransactionModal";
import Loader from "../components/Loader"; // Componente Loader
import {
  expenseCategories,
  incomeCategories,
} from "../components/CategoryList";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("credit");
  const [filters, setFilters] = useState({
    date: "",
    type: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [modalConfirmOpen, setModalConfirmOpen] = useState({
    open: false,
    id: null,
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [category, setCategory] = useState("");

  // Obter ID do usuário logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchTransactions(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Buscar transações do Firestore
  async function fetchTransactions(uid) {
    setLoading(true);
    try {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTransactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addTransaction(type, description, amount, date, category) {
    if (!userId) return;
    setLoading(true);
    setMessage("");

    try {
      const newTransaction = {
        userId,
        type,
        description,
        amount,
        date,
        category,
      };

      const docRef = await addDoc(
        collection(db, "transactions"),
        newTransaction
      );
      newTransaction.id = docRef.id;
      setTransactions([...transactions, newTransaction]);
      setMessage("Transação salva com sucesso!");
      setTimeout(() => setMessage(""), 3000);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Erro ao salvar a transação. Tente novamente!");
    } finally {
      setLoading(false);
    }
  }

  async function removeTransaction(id) {
    if (!id) return;
    setLoading(true);

    try {
      await deleteDoc(doc(db, "transactions", id));
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
      setMessage("Transação removida com sucesso!");
      setTimeout(() => setMessage(""), 3000);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("Erro ao remover a transação. Tente novamente!");
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  }

  function clearFilters() {
    setFilters({ date: "", type: "" }); // Limpar os filtros
    setCategory(""); // Limpar a categoria selecionada no dropdown
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

          {/* Category Dropdown */}
          <div className="mb-4 relative w-64">
            <label className="block text-sm font-medium text-gray-700 ">
              Categoria
            </label>
            <div
              className={`w-full p-2 border rounded-lg cursor-pointer flex justify-between items-center focus:outline-none ${
                filters.category
                  ? "focus:ring-2 focus:ring-green-800"
                  : "focus:ring-2 focus:ring-gray-300"
              }`}
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {category || "Selecione uma categoria"}
              {showCategoryDropdown ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showCategoryDropdown && (
              <div className="absolute w-full bg-white border rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
                {[...expenseCategories, ...incomeCategories].map(
                  (cat, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCategory(cat.name);
                        setFilters({ ...filters, category: cat.name });
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <div className="text-xl mr-2">{cat.icon}</div>
                      <span className="text-sm">{cat.name}</span>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <button
            onClick={clearFilters}
            className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            <FaRedoAlt />
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 text-center rounded-lg mt-4 ${
            message.includes("Erro")
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {message}
        </div>
      )}

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
