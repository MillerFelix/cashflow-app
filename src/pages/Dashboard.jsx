import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BalanceModal from "../components/dashboard/BalanceModal";
import Loader from "../components/common/Loader";
import SmartCalendar from "../components/dashboard/SmartCalendar";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import { useCards } from "../hooks/useCards";
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
  FaLightbulb,
  FaUserCog,
  FaClock,
  FaTags,
  FaArrowRight,
} from "react-icons/fa";

function Dashboard() {
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Usuário",
    avatar: "1.png",
    payDay: null,
    payDay2: null,
    workModel: null,
    financialFocus: null,
  });

  const { fetchGoals } = useGoals();
  const user = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();

  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
  } = useTransactions(userId);
  const { cards } = useCards(userId);
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
            const data = userSnapshot.data();
            setUserProfile({
              name: data.name?.split(" ")[0] || "Usuário",
              avatar: data.avatar || "1.png",
              payDay: data.payDay ? parseInt(data.payDay) : null,
              payDay2: data.payDay2 ? parseInt(data.payDay2) : null,
              workModel: data.workModel || null,
              financialFocus: data.financialFocus || null,
            });
            if (!data.hasSetupInitialBalance) setShowBalanceModal(true);
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

  // --- LÓGICA FINANCEIRA ---

  const globalBalance = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return transactions.reduce((acc, t) => {
      if (t.date > todayStr) return acc;
      return t.type === "credit" ? acc + t.value : acc - t.value;
    }, 0);
  }, [transactions]);

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
          t.type === "credit" ? (fInc += t.value) : (fExp += t.value);
        } else {
          t.type === "credit" ? (rInc += t.value) : (rExp += t.value);
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

  // --- LÓGICA INTELIGENTE ---

  const daysUntilPayday = useMemo(() => {
    const payDays = [];
    if (userProfile.payDay) payDays.push(userProfile.payDay);
    if (userProfile.payDay2) payDays.push(userProfile.payDay2);
    if (payDays.length === 0) return null;
    const todayDay = todayDate.getDate();
    let minDays = Infinity;
    payDays.forEach((day) => {
      let diff;
      if (todayDay < day) diff = day - todayDay;
      else {
        const nextMonth = new Date(
          todayDate.getFullYear(),
          todayDate.getMonth() + 1,
          day,
        );
        const diffTime = Math.abs(nextMonth - todayDate);
        diff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      if (diff < minDays) minDays = diff;
    });
    return minDays;
  }, [userProfile.payDay, userProfile.payDay2]);

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

    let dangerThreshold = 0.15;
    let warningThreshold = 0.05;
    if (userProfile.financialFocus === "debt") {
      dangerThreshold = 0.1;
      warningThreshold = 0.02;
    } else if (userProfile.financialFocus === "invest") {
      dangerThreshold = 0.12;
    }

    if (spendingProgress > 0.95)
      return {
        status: "danger",
        icon: <FaFireAlt />,
        color: "red",
        title: "Esgotado",
        message: "Você já consumiu quase toda sua renda mensal.",
      };
    if (difference > dangerThreshold)
      return {
        status: "danger",
        icon: <FaFireAlt />,
        color: "red",
        title: "Ritmo Acelerado",
        message: "Freie agora! Seus gastos estão muito rápidos.",
      };
    if (difference > warningThreshold)
      return {
        status: "warning",
        icon: <FaExclamationTriangle />,
        color: "yellow",
        title: "Atenção",
        message: "Você está gastando um pouco acima do ideal.",
      };

    let successMsg = "Seu ritmo está saudável.";
    if (userProfile.financialFocus === "invest")
      successMsg = "Excelente! Sobrando dinheiro para investir.";
    if (userProfile.financialFocus === "debt")
      successMsg = "Ótimo! Você está economizando como planejado.";

    return {
      status: "success",
      icon: <FaCheckCircle />,
      color: "green",
      title: "No Controle",
      message: successMsg,
    };
  }, [totalMonthIncome, totalMonthExpenseSoFar, userProfile.financialFocus]);

  const smartInsight = useMemo(() => {
    if (globalBalance < 0)
      return {
        type: "alert",
        text: "Sua conta está negativa. Priorize cobrir o saldo.",
      };
    if (
      daysUntilPayday !== null &&
      daysUntilPayday <= 7 &&
      daysUntilPayday > 0
    ) {
      if (globalBalance < 200)
        return {
          type: "warning",
          text: `Faltam ${daysUntilPayday} dias para cair dinheiro. Segure os gastos!`,
        };
      return {
        type: "info",
        text: `Faltam ${daysUntilPayday} dias para a próxima entrada. Você tem ${formatCurrency(globalBalance)} disponível.`,
      };
    }
    if (
      userProfile.workModel === "autonomo" ||
      userProfile.workModel === "pj"
    ) {
      if (futureIncome === 0)
        return {
          type: "tip",
          text: "Como autônomo, não esqueça de registrar suas entradas previstas.",
        };
    }
    if (futureExpense > globalBalance)
      return {
        type: "warning",
        text: "Atenção: Seus agendamentos futuros superam seu saldo atual.",
      };
    return {
      type: "tip",
      text: "Mantenha o foco! Gastar com consciência é o caminho.",
    };
  }, [globalBalance, daysUntilPayday, userProfile, futureExpense]);

  // Ranking de Gastos Rico (Top 5)
  const categoryRanking = useMemo(() => {
    const expenses = monthTransactions.filter((t) => t.type === "debit");
    const grouped = expenses.reduce((acc, t) => {
      // Prioridade para Subcategoria para ser mais específico
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
      .slice(0, 5); // TOP 5
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
        {/* HEADER */}
        <div className="flex justify-between items-center px-1">
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gray-200 group-hover:ring-2 ring-blue-400 transition-all">
              <img
                src={`/avatars/${userProfile.avatar}`}
                alt="User"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                Olá, {userProfile.name}
              </h1>
              <p className="text-gray-500 text-xs capitalize mt-0.5 flex items-center gap-1">
                <FaCalendarCheck size={10} /> {todayFormatted}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
          >
            {isVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        {!userProfile.financialFocus && (
          <div
            onClick={() => navigate("/profile")}
            className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-200 p-2 rounded-full text-indigo-700">
                <FaUserCog />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">
                  Potencialize seu Dashboard
                </h4>
                <p className="text-xs text-indigo-700">
                  Configure seu perfil financeiro para receber análises
                  personalizadas.
                </p>
              </div>
            </div>
            <FaCheckCircle className="text-indigo-300" />
          </div>
        )}

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              Disponível em conta
            </p>
          </div>

          <div className="p-6 rounded-3xl shadow-lg text-white bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col justify-between relative overflow-hidden h-40 group hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 opacity-90 mb-1">
                <FaChartLine className="text-blue-200" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Previsão Final
                </p>
              </div>
              <h2 className="text-3xl font-black tracking-tight mt-2">
                {isVisible ? formatCurrency(projectedBalance) : "••••••"}
              </h2>
            </div>
            {daysUntilPayday !== null ? (
              <p className="text-xs text-blue-100 font-bold bg-blue-800/30 py-1 px-2 rounded-lg inline-block w-max flex items-center gap-1">
                <FaClock size={10} /> Faltam {daysUntilPayday} dias para receber
              </p>
            ) : (
              <p className="text-[10px] text-blue-100/70 font-medium">
                Previsão baseada em agendamentos.
              </p>
            )}
          </div>

          <div
            className={`p-6 rounded-3xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden h-40 transition-colors duration-500 ${financialPace.color === "red" ? "bg-gradient-to-br from-red-600 to-rose-900" : financialPace.color === "yellow" ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-gradient-to-br from-green-600 to-emerald-800"}`}
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

        {/* --- SEÇÃO DE ANÁLISE DETALHADA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RANKING RICO (Substituindo o Gráfico e o Vilão Antigo) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <FaTags className="text-blue-500" /> Para onde foi seu dinheiro
            </h3>

            {categoryRanking.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-xs italic">
                Nenhum gasto registrado neste mês.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {categoryRanking.map((item, index) => {
                  // Cores sem alarme: tons de azul/indigo para neutralidade
                  const isTop1 = index === 0;
                  return (
                    <div key={item.name} className="relative">
                      {/* Labels */}
                      <div className="flex justify-between items-end mb-1.5 z-10 relative">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold 
                            ${isTop1 ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-500"}`}
                          >
                            {index + 1}
                          </div>
                          <span
                            className={`text-sm font-bold truncate ${isTop1 ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`block text-sm font-bold ${isTop1 ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {isVisible ? formatCurrency(item.value) : "••••"}
                          </span>
                        </div>
                      </div>

                      {/* Barra de Progresso Rica */}
                      <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden flex items-center relative">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out 
                            ${isTop1 ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-300"}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                        {/* Texto da porcentagem dentro/fora da barra */}
                        <span className="absolute right-0 -top-5 text-[10px] text-gray-400 font-medium">
                          {Math.round(item.percentage)}%
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Rodapé do Card */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                  <span>Top 5 categorias do mês</span>
                  <button
                    onClick={() => navigate("/transactions")}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    Ver tudo <FaArrowRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ASSISTENTE INTELIGENTE (Direita) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col">
            <h3 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" /> Inteligência
            </h3>

            <div className="flex flex-col gap-4 flex-grow">
              <div
                className={`p-4 rounded-2xl border-l-4 ${smartInsight.type === "alert" || smartInsight.type === "warning" ? "bg-red-50 border-red-500" : smartInsight.type === "success" ? "bg-green-50 border-green-500" : "bg-blue-50 border-blue-500"}`}
              >
                <h4 className="text-xs font-bold uppercase mb-1 opacity-80">
                  Insight do Dia
                </h4>
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {smartInsight.text}
                </p>
              </div>
              {futureExpense > 0 && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">
                    Próximas Saídas
                  </h4>
                  <p className="text-sm text-gray-700 leading-snug">
                    Você tem <strong>{formatCurrency(futureExpense)}</strong>{" "}
                    agendados para sair.
                  </p>
                </div>
              )}
              <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400 italic">
                  "O app aprende com você. Mantenha seu perfil atualizado."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDÁRIO */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2 ml-1">
            <FaCalendarAlt className="text-gray-400" /> Agenda Financeira
          </h3>
          <SmartCalendar transactions={transactions} cards={cards} />
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
