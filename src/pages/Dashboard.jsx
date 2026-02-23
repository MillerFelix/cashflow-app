import React, { useEffect, useState, useMemo } from "react";
import BalanceModal from "../components/dashboard/BalanceModal";
import Loader from "../components/common/Loader";
import TransactionModal from "../components/transactions/TransactionModal";
import BalanceVisibilityToggle from "../components/dashboard/BalanceVisibilityToggle";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import useGoals from "../hooks/useGoals";
import {
  FaPlus,
  FaLightbulb,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

function Dashboard() {
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const { goals, fetchGoals } = useGoals();
  const user = useAuth();
  const userId = user?.uid;

  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
  } = useTransactions(userId);
  const [loading, setLoading] = useState(true);

  const storedVisibility = localStorage.getItem("balanceVisibility");
  const [isVisible, setIsVisible] = useState(storedVisibility === "true");

  // --- SETUP INICIAL ---
  useEffect(() => {
    async function fetchUserData() {
      if (userId) {
        try {
          setLoading(true);
          const userDoc = doc(db, "users", userId);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUserName(userData.name?.split(" ")[0] || "Usuário");
            if (!userData.hasSetupInitialBalance) setShowBalanceModal(true);
          }
        } catch (error) {
          console.error("Erro:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    if (userId) {
      fetchGoals();
      fetchUserData();
    }
  }, [userId, fetchGoals]);

  useEffect(
    () => localStorage.setItem("balanceVisibility", isVisible),
    [isVisible],
  );

  // --- MATEMÁTICA DA TELA ---
  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  const todayFormatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // 1. Saldos e Filtros de Data
  const globalBalance = useMemo(
    () =>
      transactions.reduce(
        (acc, t) => (t.type === "credit" ? acc + t.value : acc - t.value),
        0,
      ),
    [transactions],
  );

  const currentMonthYear = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const currentTrans = useMemo(
    () => transactions.filter((t) => t.date.startsWith(currentMonthYear)),
    [transactions, currentMonthYear],
  );

  // 2. Resumo do Mês (Entrou, Saiu, Sobrou)
  const monthIncome = useMemo(
    () =>
      currentTrans
        .filter((t) => t.type === "credit")
        .reduce((acc, t) => acc + t.value, 0),
    [currentTrans],
  );
  const monthExpense = useMemo(
    () =>
      currentTrans
        .filter((t) => t.type === "debit")
        .reduce((acc, t) => acc + t.value, 0),
    [currentTrans],
  );
  const monthBalance = monthIncome - monthExpense;

  // 3. Orçamentos
  const budgetGoals = useMemo(
    () => goals.filter((g) => g.type === "expense"),
    [goals],
  );
  const totalBudget = useMemo(
    () => budgetGoals.reduce((sum, g) => sum + g.goalValue, 0),
    [budgetGoals],
  );
  const freeBalance = globalBalance - totalBudget;

  // 4. Ranking de Categorias (Onde mais gastou)
  const categoryRanking = useMemo(() => {
    const expenses = currentTrans.filter((t) => t.type === "debit");
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.value;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, value]) => ({
        category,
        value,
        percentage: (value / (monthExpense || 1)) * 100,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categorias
  }, [currentTrans, monthExpense]);

  // 5. Inteligência de Dados (Insights Reais)
  const smartInsights = useMemo(() => {
    const alerts = [];

    // Alerta de Fluxo de Caixa
    if (monthExpense > monthIncome && monthIncome > 0) {
      alerts.push({
        text: `Alerta: Você já gastou ${formatCurrency(monthExpense - monthIncome)} a mais do que ganhou este mês.`,
        type: "danger",
      });
    } else if (monthIncome > 0 && monthBalance > 0) {
      alerts.push({
        text: `Muito bem! Você já garantiu ${formatCurrency(monthBalance)} de sobra este mês.`,
        type: "success",
      });
    }

    // Alerta de Categoria (Ralo Financeiro)
    if (categoryRanking.length > 0) {
      const topCat = categoryRanking[0];
      if (topCat.percentage > 40) {
        alerts.push({
          text: `Atenção: "${topCat.category}" representa ${Math.round(topCat.percentage)}% de todas as suas despesas.`,
          type: "warning",
        });
      }
    }

    // Alerta de Orçamento Estourado
    budgetGoals.forEach((g) => {
      const pct = (g.currentValue / g.goalValue) * 100;
      if (pct >= 90) {
        alerts.push({
          text: `O limite de "${g.category}" está quase no fim (${Math.round(pct)}% consumido).`,
          type: "danger",
        });
      }
    });

    if (alerts.length === 0) {
      alerts.push({
        text: "Tudo sob controle! Continue a registar os seus movimentos.",
        type: "info",
      });
    }

    return alerts.slice(0, 3); // Mostra no máximo os 3 mais importantes
  }, [monthIncome, monthExpense, monthBalance, categoryRanking, budgetGoals]);

  // --- AÇÕES ---
  const handleSaveInitialBalance = async (initialValue) => {
    if (initialValue > 0)
      await addTransaction(
        "credit",
        "Saldo Inicial",
        initialValue,
        new Date().toISOString().split("T")[0],
        "Outros Ganhos",
        false,
      );
    await setDoc(
      doc(db, "users", userId),
      { hasSetupInitialBalance: true },
      { merge: true },
    );
    setShowBalanceModal(false);
  };

  const handleSaveTransaction = async (data) => {
    await addTransaction(
      data.type,
      data.description,
      data.value,
      data.date,
      data.category,
      data.subcategory,
      data.isFixed,
    );
    setIsTransactionModalOpen(false);
  };

  if (loading || transactionsLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="p-4 sm:p-5 bg-gray-100 min-h-screen relative font-sans text-gray-800 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center px-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Olá, {userName}
            </h1>
            <p className="text-gray-500 text-xs capitalize mt-0.5">
              {todayFormatted}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2 bg-white rounded-full shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {isVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </button>
        </div>

        {/* 1️⃣ RESUMO FINANCEIRO (TOPO) - Agora com 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Saldo Atual (Verde) */}
          <div className="p-5 rounded-2xl shadow-sm text-white bg-gradient-to-br from-emerald-500 to-green-700 flex flex-col justify-center min-h-[110px]">
            <p className="text-white/80 font-bold text-xs uppercase tracking-wider mb-1">
              Saldo Atual
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isVisible ? formatCurrency(globalBalance) : "••••••"}
            </h2>
          </div>

          {/* Card 2: Disponível no Mês (Amarelo/Roxo) */}
          <div className="p-5 rounded-2xl shadow-sm text-white bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-700 flex flex-col justify-center min-h-[110px]">
            <p className="text-white/90 font-bold text-xs uppercase tracking-wider mb-1">
              Disponível (Pós-Orçamento)
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isVisible ? formatCurrency(freeBalance) : "••••••"}
            </h2>
          </div>

          {/* Card 3: Resumo do Mês (Entrou/Saiu/Sobrou) */}
          <div className="p-5 rounded-2xl shadow-sm bg-white border border-gray-200 flex flex-col justify-center min-h-[110px]">
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">
              Balanço deste Mês
            </p>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Entrou</span>
                <span className="text-green-600">
                  +{isVisible ? formatCurrency(monthIncome) : "••••"}
                </span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-600">Saiu</span>
                <span className="text-red-500">
                  -{isVisible ? formatCurrency(monthExpense) : "••••"}
                </span>
              </div>
              <div className="w-full h-[1px] bg-gray-100 my-0.5"></div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-800">Sobrou</span>
                <span
                  className={
                    monthBalance >= 0 ? "text-blue-600" : "text-orange-500"
                  }
                >
                  {isVisible ? formatCurrency(monthBalance) : "••••"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID INFERIOR (Mais largo e compacto) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* COLUNA ESQUERDA (Maior, focada nos gastos) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* 2️⃣ USO DO ORÇAMENTO (Múltiplas Categorias) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
                Uso do Orçamento
              </h3>
              {budgetGoals.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  Você ainda não definiu limites para suas categorias.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {budgetGoals.map((goal) => {
                    const pct = Math.min(
                      (goal.currentValue / goal.goalValue) * 100,
                      100,
                    );
                    const barColor =
                      pct >= 90
                        ? "bg-red-500"
                        : pct >= 75
                          ? "bg-yellow-400"
                          : "bg-blue-500";

                    return (
                      <div key={goal.id} className="w-full">
                        <div className="flex justify-between items-end mb-1">
                          <span className="font-semibold text-gray-700 text-sm">
                            {goal.category}
                          </span>
                          <span className="font-bold text-gray-900 text-sm">
                            {isVisible
                              ? formatCurrency(goal.currentValue)
                              : "••••"}{" "}
                            <span className="text-gray-400 text-xs font-normal">
                              /{" "}
                              {isVisible
                                ? formatCurrency(goal.goalValue)
                                : "••••"}
                            </span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColor}`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3️⃣ ONDE VOCÊ MAIS GASTOU (Ranking) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex-grow">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
                Onde você mais gastou
              </h3>
              {categoryRanking.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  Nenhum gasto registrado neste mês.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {categoryRanking.map((item, index) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 w-1/2 md:w-1/3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                          {index + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-700 truncate">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex-grow mx-4 hidden sm:block">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-400 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-right w-1/3">
                        <span className="text-sm font-bold text-gray-900">
                          {isVisible ? formatCurrency(item.value) : "••••"}
                        </span>
                        <span className="text-xs text-gray-400 font-medium ml-2">
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUNA DIREITA (Insights e Contexto) */}
          <div className="flex flex-col gap-4">
            {/* 4️⃣ FIQUE DE OLHO (Dicas Baseadas em Dados) */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                <FaLightbulb className="text-yellow-500" /> Fique de Olho
              </h3>
              <div className="flex flex-col gap-3">
                {smartInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl flex gap-3 text-sm font-medium items-start
                    ${
                      insight.type === "danger"
                        ? "bg-red-50 text-red-800 border border-red-100"
                        : insight.type === "success"
                          ? "bg-green-50 text-green-800 border border-green-100"
                          : insight.type === "warning"
                            ? "bg-yellow-50 text-yellow-800 border border-yellow-100"
                            : "bg-blue-50 text-blue-800 border border-blue-100"
                    }`}
                  >
                    <div className="mt-0.5 opacity-80">
                      {insight.type === "danger" ? (
                        <FaExclamationCircle />
                      ) : insight.type === "success" ? (
                        <FaCheckCircle />
                      ) : (
                        <FaLightbulb />
                      )}
                    </div>
                    <p className="leading-snug">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5️⃣ ÚLTIMAS MOVIMENTAÇÕES */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex-grow">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                Recentes
              </h3>
              <div className="flex flex-col gap-2.5">
                {[...currentTrans]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 4)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate pr-2 w-2/3">
                        {t.description}
                      </span>
                      <span
                        className={`text-sm font-bold whitespace-nowrap ${t.type === "credit" ? "text-green-600" : "text-gray-900"}`}
                      >
                        {t.type === "credit" ? "+" : "-"}
                        {isVisible ? formatCurrency(t.value) : "••••"}
                      </span>
                    </div>
                  ))}
                {currentTrans.length === 0 && (
                  <p className="text-sm text-gray-400 italic">Sem registros.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setIsTransactionModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-black transition-all z-40"
      >
        <FaPlus />
      </button>

      {/* MODAIS */}
      {showBalanceModal && (
        <BalanceModal
          onClose={() => setShowBalanceModal(false)}
          onSave={handleSaveInitialBalance}
        />
      )}
      {isTransactionModalOpen && (
        <TransactionModal
          type="debit"
          onClose={() => setIsTransactionModalOpen(false)}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  );
}

export default Dashboard;
