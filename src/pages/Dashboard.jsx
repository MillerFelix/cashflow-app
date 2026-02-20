import React, { useEffect, useState, useMemo } from "react";
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
import MonthlyComparison from "../components/dashboard/MonthlyComparison";
import BudgetUsage from "../components/dashboard/BudgetUsage";
import FutureBalanceCard from "../components/dashboard/FutureBalanceCard";
import TopExpensesRanking from "../components/dashboard/TopExpensesRanking";
import BalanceEvolution from "../components/dashboard/BalanceEvolution";
import { expenseCategories } from "../components/category/CategoryList";
import TipsAverageCard from "../components/dashboard/TipsAverageCard";

function Dashboard() {
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [isFreeBalanceModalOpen, setIsFreeBalanceModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const { goals, fetchGoals } = useGoals();
  const user = useAuth();
  const userId = user?.uid;

  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
  } = useTransactions(userId);

  const storedVisibility = localStorage.getItem("balanceVisibility");
  const [isVisible, setIsVisible] = useState(storedVisibility === "true");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Efeito para buscar os dados do usuário e verificar o Setup Inicial
  useEffect(() => {
    async function fetchUserData() {
      if (userId) {
        try {
          setLoading(true);
          const userDoc = doc(db, "users", userId);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUserName(userData.name || "Usuário");

            // Verifica se o usuário já fez a configuração inicial do saldo
            if (!userData.hasSetupInitialBalance) {
              setShowBalanceModal(true);
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    if (userId) {
      fetchGoals();
      fetchUserData();
    }
  }, [userId, fetchGoals]);

  useEffect(() => {
    localStorage.setItem("balanceVisibility", isVisible);
  }, [isVisible]);

  // 2. O Saldo Global agora é 100% dinâmico e calculado pelo histórico
  const globalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      return t.type === "credit" ? acc + t.value : acc - t.value;
    }, 0);
  }, [transactions]);

  // 3. Calcula as despesas totais (Metas)
  const totalExpenses = useMemo(() => {
    const expenseCategoryNames = expenseCategories.map((c) => c.name);
    return goals
      .filter((goal) => expenseCategoryNames.includes(goal.category))
      .reduce((sum, goal) => sum + goal.goalValue, 0);
  }, [goals]);

  // 4. Saldo livre baseado no Saldo Global calculado
  const freeBalance = useMemo(
    () => globalBalance - totalExpenses,
    [globalBalance, totalExpenses],
  );

  // 5. Filtros para os componentes que mostram dados do Mês Atual
  const currentMonthYear = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(currentMonthYear),
    );
  }, [transactions, currentMonthYear]);

  // 6. Calcula Somas de Crédito e Débito do mês atual
  const { sumDebit, sumCredit } = useMemo(() => {
    const debit = filteredTransactions
      .filter((t) => t.type === "debit")
      .reduce((acc, t) => acc + t.value, 0);

    const credit = filteredTransactions
      .filter((t) => t.type === "credit")
      .reduce((acc, t) => acc + t.value, 0);

    return { sumDebit: debit, sumCredit: credit };
  }, [filteredTransactions]);

  // 7. Salva a Transação do Setup Inicial e marca o usuário como configurado
  const handleSaveInitialBalance = async (initialValue) => {
    setSaving(true);
    try {
      if (initialValue > 0) {
        const today = new Date().toISOString().split("T")[0];
        // Registra o saldo como uma Entrada Inicial
        await addTransaction(
          "credit",
          "Saldo Inicial em Conta",
          initialValue,
          today,
          "Outros",
          false,
        );
      }

      // Marca no Firebase que a configuração inicial foi feita
      const userDocRef = doc(db, "users", userId);
      await setDoc(
        userDocRef,
        { hasSetupInitialBalance: true },
        { merge: true },
      );

      setShowBalanceModal(false);
    } catch (error) {
      console.error("Erro ao salvar saldo inicial:", error);
    } finally {
      setSaving(false);
    }
  };

  const formattedBalance = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(globalBalance);

  if (loading || saving || transactionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="mb-8 pl-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Bem-vindo, {userName}
        </h1>
        <p className="text-gray-600">
          Aqui está o resumo da sua vida financeira.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {/* Card: Saldo Atual (Sem botão de edição) */}
        <Card
          colorStart="from-green-500"
          colorEnd="to-green-800"
          title="Saldo Atual"
          className="w-full sm:w-[45%] md:w-[30%]"
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

        {/* Card: Saldo Livre */}
        <Card
          colorStart="from-purple-500"
          colorEnd="to-purple-800"
          title="Saldo Livre"
          button="Visualizar"
          onButtonClick={() => setIsFreeBalanceModalOpen(true)}
          className="w-full sm:w-[45%] md:w-[30%]"
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

        {/* Card de Balanço Resumo e Dicas */}
        {filteredTransactions.length > 0 && (
          <TipsAverageCard
            accountBalance={globalBalance}
            sumCredit={sumCredit}
            sumDebit={sumDebit}
            transactions={filteredTransactions}
            className="w-full sm:w-[45%] md:w-[30%]"
          />
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="w-full sm:w-[95%] lg:w-[80%]">
            <MonthlyComparison transactions={filteredTransactions} />
          </div>
        </div>
      )}

      {goals.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="w-full sm:w-[95%] lg:w-[80%]">
            <BudgetUsage goals={goals} />
          </div>
        </div>
      )}

      <div className="mt-0 flex justify-center">
        <div className="w-full sm:w-[95%] lg:w-[80%]">
          <FutureBalanceCard
            currentBalance={globalBalance}
            transactions={transactions}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <GraphCard
            colorStart="from-red-500"
            colorEnd="to-red-800"
            title="Gastos"
            className="w-full"
          >
            {sumDebit === 0 ? (
              <div className="flex flex-col items-center justify-center text-white mt-6">
                <p className="text-lg font-semibold">
                  Você ainda não fez débitos
                </p>
                <img
                  src="/no-debit-image.svg"
                  alt="Nenhuma transação"
                  className="mt-4 w-48 opacity-70"
                />
              </div>
            ) : (
              <ExpenseChart transactions={filteredTransactions} />
            )}
          </GraphCard>

          <div className="flex flex-col items-center bg-red-200 p-3 rounded-lg shadow mt-4 md:mt-0 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[-12px] w-4 h-4 bg-red-700 rotate-45 rounded-sm"></div>
            <span className="text-sm text-gray-700">Gasto Total</span>
            <span className="text-lg font-semibold text-red-700">
              {sumDebit.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <GraphCard
            colorStart="from-blue-500"
            colorEnd="to-blue-800"
            title="Ganhos"
            className="w-full"
          >
            {sumCredit === 0 ? (
              <div className="flex flex-col items-center justify-center text-white mt-6">
                <p className="text-lg font-semibold">
                  Você ainda não fez créditos
                </p>
                <img
                  src="/no-credit-image.svg"
                  alt="Nenhuma transação"
                  className="mt-4 w-48 opacity-70"
                />
              </div>
            ) : (
              <IncomeChart transactions={filteredTransactions} />
            )}
          </GraphCard>

          <div className="flex flex-col items-center bg-blue-200 p-3 rounded-lg shadow mt-4 md:mt-0 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[-12px] w-4 h-4 bg-blue-700 rotate-45 rounded-sm"></div>
            <span className="text-sm text-gray-700">Ganho Total</span>
            <span className="text-lg font-semibold text-blue-700">
              {sumCredit.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="w-full sm:w-[95%] lg:w-[80%] grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopExpensesRanking transactions={filteredTransactions} />
            <BalanceEvolution transactions={transactions} />
          </div>
        </div>
      )}

      {isFreeBalanceModalOpen && (
        <FreeBalanceModal
          onClose={() => setIsFreeBalanceModalOpen(false)}
          balance={globalBalance}
          totalExpenses={totalExpenses}
          goals={goals}
        />
      )}

      {/* Modal de Setup Inicial */}
      {showBalanceModal && (
        <BalanceModal
          onClose={() => setShowBalanceModal(false)}
          onSave={handleSaveInitialBalance}
        />
      )}
    </div>
  );
}

export default Dashboard;
