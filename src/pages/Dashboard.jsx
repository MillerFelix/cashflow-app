import React, { useEffect, useState, useMemo } from "react";
import BalanceModal from "../components/dashboard/BalanceModal";
import Loader from "../components/common/Loader";
import TransactionModal from "../components/transactions/TransactionModal";
import SmartCalendar from "../components/dashboard/SmartCalendar"; // IMPORTADO AQUI
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import useGoals from "../hooks/useGoals";
import {
  FaEye,
  FaEyeSlash,
  FaWallet,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFireAlt,
  FaCalendarCheck,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";

function Dashboard() {
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [userName, setUserName] = useState("");

  const { fetchGoals } = useGoals();
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

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  const todayDate = new Date();
  const todayFormatted = todayDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // --- LÓGICA DE INTELIGÊNCIA FINANCEIRA ---

  const globalBalance = useMemo(
    () =>
      transactions.reduce(
        (acc, t) => (t.type === "credit" ? acc + t.value : acc - t.value),
        0,
      ),
    [transactions],
  );

  const currentMonthYear = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, "0")}`;

  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(currentMonthYear)),
    [transactions, currentMonthYear],
  );

  const { realizedIncome, realizedExpense, futureIncome, futureExpense } =
    useMemo(() => {
      const todayStr = todayDate.toISOString().split("T")[0];
      let rInc = 0,
        rExp = 0,
        fInc = 0,
        fExp = 0;

      monthTransactions.forEach((t) => {
        if (t.date > todayStr) {
          if (t.type === "credit") fInc += t.value;
          else fExp += t.value;
        } else {
          if (t.type === "credit") rInc += t.value;
          else rExp += t.value;
        }
      });
      return {
        realizedIncome: rInc,
        realizedExpense: rExp,
        futureIncome: fInc,
        futureExpense: fExp,
      };
    }, [monthTransactions]);

  const totalMonthIncome = realizedIncome + futureIncome;
  const totalMonthExpenseSoFar = realizedExpense;

  const projectedBalance = globalBalance + futureIncome - futureExpense;

  const financialPace = useMemo(() => {
    if (totalMonthIncome === 0)
      return { status: "neutral", message: "Sem receitas este mês." };

    const daysInMonth = new Date(
      todayDate.getFullYear(),
      todayDate.getMonth() + 1,
      0,
    ).getDate();
    const dayOfMonth = todayDate.getDate();

    const monthProgress = dayOfMonth / daysInMonth;
    const spendingProgress = totalMonthExpenseSoFar / totalMonthIncome;

    const difference = spendingProgress - monthProgress;

    if (spendingProgress > 0.95) {
      return {
        status: "danger",
        icon: <FaFireAlt />,
        color: "red",
        title: "Ritmo Perigoso",
        message: "Você já consumiu quase toda sua renda mensal.",
      };
    }
    if (difference > 0.15) {
      return {
        status: "danger",
        icon: <FaFireAlt />,
        color: "red",
        title: "Ritmo Acelerado",
        message:
          "Cuidado! Você está gastando mais rápido do que os dias passam.",
      };
    }
    if (difference > 0.05) {
      return {
        status: "warning",
        icon: <FaExclamationTriangle />,
        color: "yellow",
        title: "Atenção",
        message: "Seus gastos estão um pouco acima do ideal para hoje.",
      };
    }
    return {
      status: "success",
      icon: <FaCheckCircle />,
      color: "green",
      title: "Dentro do Planejado",
      message: "Parabéns! Seu ritmo de gastos está saudável e controlado.",
    };
  }, [totalMonthIncome, totalMonthExpenseSoFar]);

  // --- RANKING POR SUBCATEGORIA ---
  const categoryRanking = useMemo(() => {
    const expenses = monthTransactions.filter((t) => t.type === "debit");
    const grouped = expenses.reduce((acc, t) => {
      const key = t.subcategory || t.category;
      acc[key] = (acc[key] || 0) + t.value;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / (realizedExpense || 1)) * 100,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [monthTransactions, realizedExpense]);

  const handleSaveInitialBalance = async (initialValue) => {
    if (initialValue > 0) {
      await addTransaction({
        type: "credit",
        description: "Saldo Inicial",
        value: initialValue,
        date: new Date().toISOString().split("T")[0],
        category: "Outros Ganhos",
        paymentMethod: "transfer",
        isFixed: false,
      });
    }
    await setDoc(
      doc(db, "users", userId),
      { hasSetupInitialBalance: true },
      { merge: true },
    );
    setShowBalanceModal(false);
  };

  if (loading || transactionsLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen relative font-sans text-gray-800 pb-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center px-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Olá, {userName}
            </h1>
            <p className="text-gray-500 text-xs capitalize mt-1 flex items-center gap-1">
              <FaCalendarCheck size={10} /> {todayFormatted}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
          >
            {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        {/* --- GRID DE CARDS INTELIGENTES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. SALDO ATUAL */}
          <div className="p-6 rounded-3xl shadow-lg text-white bg-gradient-to-br from-emerald-600 to-teal-900 flex flex-col justify-between relative overflow-hidden h-40 group hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 opacity-90 mb-1">
                <FaWallet className="text-emerald-200" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Saldo Atual
                </p>
              </div>
              <h2 className="text-3xl font-black tracking-tight mt-2">
                {isVisible ? formatCurrency(globalBalance) : "••••••"}
              </h2>
            </div>
            <p className="text-[10px] text-emerald-100/70 font-medium">
              Dinheiro disponível agora em todas as contas.
            </p>
          </div>

          {/* 2. PREVISÃO DE FECHAMENTO */}
          <div className="p-6 rounded-3xl shadow-lg text-white bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col justify-between relative overflow-hidden h-40 group hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 opacity-90 mb-1">
                <FaChartLine className="text-blue-200" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Previsão Final do Mês
                </p>
              </div>
              <h2 className="text-3xl font-black tracking-tight mt-2">
                {isVisible ? formatCurrency(projectedBalance) : "••••••"}
              </h2>
            </div>
            <p className="text-[10px] text-blue-100/70 font-medium">
              Considerando o que você tem hoje + o que está agendado.
            </p>
          </div>

          {/* 3. RITMO FINANCEIRO */}
          <div
            className={`p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden h-40 transition-colors duration-500
            ${
              financialPace.color === "red"
                ? "bg-gradient-to-br from-red-600 to-rose-900"
                : financialPace.color === "yellow"
                  ? "bg-gradient-to-br from-orange-400 to-orange-600"
                  : "bg-gradient-to-br from-green-600 to-emerald-800"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  Ritmo Atual
                </p>
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                  {financialPace.icon}
                </div>
              </div>
              <h2 className="text-xl font-black tracking-tight leading-none">
                {financialPace.title}
              </h2>
            </div>
            <p className="text-xs font-medium opacity-90 leading-snug mt-2">
              {financialPace.message}
            </p>
          </div>
        </div>

        {/* --- CONTEÚDO PRINCIPAL (Ranking & Dicas) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RANKING DE GASTOS */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <FaTrophy className="text-red-500" /> Vilões do Orçamento (Top 5)
            </h3>

            {categoryRanking.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 text-sm italic">
                  Nenhum gasto registrado neste mês.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {categoryRanking.map((item, index) => {
                  let colorClass = "bg-gray-400";
                  if (index === 0) colorClass = "bg-red-700";
                  else if (index === 1) colorClass = "bg-red-600";
                  else if (index === 2) colorClass = "bg-red-500";
                  else if (index === 3) colorClass = "bg-orange-500";
                  else if (index === 4) colorClass = "bg-orange-400";

                  return (
                    <div key={item.name} className="relative group">
                      <div className="flex justify-between items-end mb-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${colorClass}`}
                          >
                            {index + 1}
                          </span>
                          <span className="font-bold text-gray-800 text-sm truncate">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-gray-900 text-sm">
                            {isVisible ? formatCurrency(item.value) : "••••"}
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-gray-400 text-right mt-1 font-medium">
                        {Math.round(item.percentage)}% dos gastos
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FIQUE DE OLHO */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col">
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <FaFireAlt className="text-orange-500" /> Insights Rápidos
            </h3>

            <div className="flex flex-col gap-4 flex-grow">
              <div
                className={`p-4 rounded-2xl border-l-4 ${realizedExpense > realizedIncome ? "bg-red-50 border-red-500" : "bg-green-50 border-green-500"}`}
              >
                <h4
                  className={`text-xs font-bold uppercase mb-1 ${realizedExpense > realizedIncome ? "text-red-700" : "text-green-700"}`}
                >
                  Balanço Atual
                </h4>
                <p className="text-sm text-gray-700 leading-snug">
                  {realizedExpense > realizedIncome
                    ? `Cuidado! Você já gastou ${formatCurrency(realizedExpense - realizedIncome)} a mais do que ganhou.`
                    : `Ótimo! Você está positivo em ${formatCurrency(realizedIncome - realizedExpense)}.`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border-l-4 border-blue-500">
                <h4 className="text-xs font-bold text-blue-700 uppercase mb-1">
                  Vem por aí
                </h4>
                <p className="text-sm text-gray-700 leading-snug">
                  Você ainda tem{" "}
                  <strong>{formatCurrency(futureExpense)}</strong> agendados
                  para sair da conta este mês.
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400 italic">
                  "O segredo não é quanto você ganha, mas como você gasta."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- SEÇÃO DO CALENDÁRIO INTELIGENTE --- */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2 ml-1">
            <FaCalendarAlt className="text-gray-400" /> Agenda Financeira
          </h3>
          <SmartCalendar transactions={transactions} />
        </div>
      </div>

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
