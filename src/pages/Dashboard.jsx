import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import { useCards } from "../hooks/useCards";
import useGoals from "../hooks/useGoals";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";

// Components
import Loader from "../components/common/Loader";
import HelpModal from "../components/footer/HelpModal";
import SmartCalendar from "../components/dashboard/SmartCalendar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardCards from "../components/dashboard/DashboardCards";
import CategoryRankingCard from "../components/dashboard/CategoryRankingCard";
import SmartInsightCard from "../components/dashboard/SmartInsightCard";
import { FaCalendarAlt } from "react-icons/fa";

function Dashboard() {
  const user = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: "Usuário",
    avatar: "1.png",
    payDay: null,
    payDay2: null,
    workModel: null,
    financialFocus: null,
  });

  const { fetchGoals } = useGoals();
  const { cards } = useCards(userId);
  const {
    transactions,
    loading: transactionsLoading,
    addTransaction,
  } = useTransactions(userId);

  const storedVisibility = localStorage.getItem("balanceVisibility");
  const [isVisible, setIsVisible] = useState(storedVisibility === "true");

  useEffect(() => {
    let isMounted = true;
    async function fetchUserData() {
      if (!userId) {
        if (isMounted) setIsProfileLoading(false);
        return;
      }
      try {
        const userSnapshot = await getDoc(doc(db, "users", userId));
        if (isMounted && userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserProfile({
            name: data.name?.split(" ")[0] || "Usuário",
            avatar: data.avatar || "1.png",
            payDay: data.payDay ? parseInt(data.payDay, 10) : null,
            payDay2: data.payDay2 ? parseInt(data.payDay2, 10) : null,
            workModel: data.workModel || null,
            financialFocus: data.financialFocus || null,
          });
          if (!data.hasSetupInitialBalance) setShowOnboarding(true);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        if (isMounted) setIsProfileLoading(false);
      }
    }

    if (userId) {
      fetchGoals();
      fetchUserData();
    }
    return () => {
      isMounted = false;
    };
  }, [userId, fetchGoals]);

  useEffect(() => {
    localStorage.setItem("balanceVisibility", isVisible);
  }, [isVisible]);

  // Hook isolado que processa toda a matemática baseada nos dados do Firebase
  const metrics = useDashboardMetrics(transactions, userProfile);

  const handleSaveInitialBalance = async (initialValueRaw) => {
    const value =
      typeof initialValueRaw === "string"
        ? parseInt(initialValueRaw.replace(/\D/g, ""), 10) / 100
        : initialValueRaw;

    if (value > 0) {
      await addTransaction({
        type: "credit",
        description: "Saldo Inicial",
        value,
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
    setShowOnboarding(false);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen relative font-sans text-gray-800 pb-10">
      {isProfileLoading && (
        <div className="absolute inset-0 bg-gray-100/80 z-40 flex items-center justify-center backdrop-blur-sm transition-opacity duration-500">
          <Loader />
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Cabeçalho Isolado */}
        <DashboardHeader
          userProfile={userProfile}
          todayFormatted={metrics.todayFormatted}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          navigate={navigate}
        />

        {/* Cards de Métricas Isolados */}
        <DashboardCards
          transactionsLoading={transactionsLoading}
          isVisible={isVisible}
          globalBalance={metrics.globalBalance}
          projectedBalance={metrics.projectedBalance}
          daysUntilPayday={metrics.daysUntilPayday}
          financialPace={metrics.financialPace}
          formatCurrency={metrics.formatCurrency}
        />

        {/* Rankings e Insights Isolados */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CategoryRankingCard
            categoryRanking={metrics.categoryRanking}
            isVisible={isVisible}
            formatCurrency={metrics.formatCurrency}
          />
          <SmartInsightCard
            smartInsight={metrics.smartInsight}
            futureExpense={metrics.futureExpense}
            formatCurrency={metrics.formatCurrency}
          />
        </div>

        {/* Calendário */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center gap-2 ml-1">
            <FaCalendarAlt className="text-gray-400" /> Agenda Financeira
          </h3>
          <SmartCalendar transactions={transactions} cards={cards} />
        </div>
      </div>

      {showOnboarding && (
        <HelpModal
          isOpen={showOnboarding}
          isOnboarding={true}
          onSaveBalance={handleSaveInitialBalance}
          onClose={() => {}}
        />
      )}
    </div>
  );
}

export default Dashboard;
