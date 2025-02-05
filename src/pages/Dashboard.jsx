import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import BalanceModal from "../components/dashboard/BalanceModal";
import FreeBalanceModal from "../components/dashboard/FreeBalanceModal";
import Loader from "../components/common/Loader";
import BalanceVisibilityToggle from "../components/dashboard/BalanceVisibilityToggle";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import IncomeChart from "../components/dashboard/IncomeChart";
import GraphCard from "../components/dashboard/GraphCard";
import useGoals from "../hooks/useGoals";
import { expenseCategories } from "../components/category/CategoryList";

function Dashboard() {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isFreeBalanceModalOpen, setIsFreeBalanceModalOpen] = useState(false);
  const { goals, fetchGoals } = useGoals();
  const [balance, setBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0); // Novo estado para o total de despesas
  const storedVisibility = localStorage.getItem("balanceVisibility");
  const [isVisible, setIsVisible] = useState(storedVisibility === "true");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const userId = useAuth();
  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
  } = useTransactions(userId);

  useEffect(() => {
    async function fetchBalance() {
      if (userId) {
        try {
          setLoading(true);
          const userDoc = doc(db, "users", userId);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setBalance(userSnapshot.data().balance || 0);
          }
        } catch (error) {
          console.error("Erro ao buscar saldo:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchGoals();

    fetchBalance();
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("balanceVisibility", isVisible);
  }, [isVisible]);

  useEffect(() => {
    // Atualiza o total de despesas ao alterar as metas
    const expenseCategoryNames = expenseCategories.map((c) => c.name);

    const total = goals
      .filter((goal) => expenseCategoryNames.includes(goal.category))
      .reduce((sum, goal) => sum + goal.goalValue, 0);

    setTotalExpenses(total);
  }, [goals]);

  const freeBalance = balance - totalExpenses;

  async function handleSaveBalance(newBalance) {
    if (userId) {
      setSaving(true);
      try {
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, { balance: newBalance }, { merge: true });

        const difference = newBalance - balance;
        if (difference !== 0) {
          await addTransaction(
            difference > 0 ? "credit" : "debit",
            "Ajuste de saldo",
            Math.abs(difference),
            new Date().toISOString().split("T")[0],
            "Saldo"
          );
        }
        setBalance(newBalance);
        setSuccessMessage("Saldo atualizado com sucesso!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Erro ao salvar saldo:", error);
      } finally {
        setSaving(false);
      }
    }
  }

  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(balance);

  if (loading || saving || transactionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  const filteredTransactions = transactions.filter(
    (transaction) => transaction.category !== "Saldo"
  );

  function calculateSums(transactions) {
    const sumDebit = transactions
      .filter((transaction) => transaction.type === "debit")
      .reduce((acc, transaction) => acc + transaction.value, 0);

    const sumCredit = transactions
      .filter((transaction) => transaction.type === "credit")
      .reduce((acc, transaction) => acc + transaction.value, 0);

    return { sumDebit, sumCredit };
  }

  const { sumDebit, sumCredit } = calculateSums(filteredTransactions);

  return (
    <div className="p-8 bg-gray-100">
      <div className="flex gap-8 flex-wrap justify-center md:justify-start relative">
        <Card
          colorStart="from-green-500"
          colorEnd="to-green-800"
          title="Saldo Atual"
          button="Atualizar Saldo"
          onButtonClick={() => setIsBalanceModalOpen(true)}
          className="w-full sm:w-[45%] lg:w-[30%]" // Cards maiores
        >
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-yellow-300">
              {isVisible ? formattedBalance : "******"}
            </p>
            <BalanceVisibilityToggle
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            />
          </div>
        </Card>

        <Card
          colorStart="from-purple-500"
          colorEnd="to-purple-800"
          title="Saldo Livre"
          button="Visualizar"
          onButtonClick={() => setIsFreeBalanceModalOpen(true)}
          className="w-full sm:w-[45%] lg:w-[30%]" // Cards maiores
        >
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-white">
              {freeBalance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </Card>
      </div>

      {successMessage && (
        <div className="p-4 text-center rounded-lg my-4 bg-green-200 text-green-800 shadow-md">
          {successMessage}
        </div>
      )}

      {/* Ajuste no layout dos gráficos */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraphCard
          colorStart="from-red-500"
          colorEnd="to-red-800"
          title="Gastos"
          className="w-full"
        >
          <ExpenseChart transactions={filteredTransactions} />
          <div className="mt-4 flex flex-col items-center bg-red-200 p-3 rounded-lg shadow">
            <span className="text-sm text-gray-700">Gasto Total</span>
            <span className="text-lg font-semibold text-red-700">
              {sumDebit.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </GraphCard>

        <GraphCard
          colorStart="from-blue-500"
          colorEnd="to-blue-800"
          title="Ganhos"
          className="w-full"
        >
          <IncomeChart transactions={filteredTransactions} />
          <div className="mt-4 flex flex-col items-center bg-blue-200 p-3 rounded-lg shadow">
            <span className="text-sm text-gray-700">Ganho Total</span>
            <span className="text-lg font-semibold text-blue-700">
              {sumCredit.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </GraphCard>
      </div>
      {/* Modal de Saldo Livre */}
      {isFreeBalanceModalOpen && (
        <FreeBalanceModal
          onClose={() => setIsFreeBalanceModalOpen(false)}
          balance={balance}
          totalExpenses={totalExpenses}
        />
      )}

      {/* Modal de Saldo Atual */}
      {isBalanceModalOpen && (
        <BalanceModal
          onClose={() => setIsBalanceModalOpen(false)}
          onSave={handleSaveBalance}
          initialBalance={(balance * 100).toString()}
        />
      )}
    </div>
  );
}

export default Dashboard;
