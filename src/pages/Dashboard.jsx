import React, { useEffect, useState } from "react";
import Card from "../components/common/Card";
import BalanceModal from "../components/dashboard/BalanceModal";
import Loader from "../components/common/Loader";
import BalanceVisibilityToggle from "../components/dashboard/BalanceVisibilityToggle";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useTransactions } from "../hooks/useTransactions";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import IncomeChart from "../components/dashboard/IncomeChart";
import GraphCard from "../components/dashboard/GraphCard";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
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

    fetchBalance();
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("balanceVisibility", isVisible);
  }, [isVisible]);

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

  // Filtra as transações para remover a categoria "Saldo"
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.category !== "Saldo"
  );

  return (
    <div className="p-8 bg-gray-100">
      <div className="flex gap-8 flex-wrap justify-center md:justify-start relative">
        <Card
          colorStart="from-green-500"
          colorEnd="to-green-800"
          title="Saldo atual"
          button="Atualizar Saldo"
          onButtonClick={() => setIsModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-yellow-300">
              {isVisible ? formattedBalance : "******"}{" "}
            </p>
            <BalanceVisibilityToggle
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            />
          </div>
        </Card>
      </div>
      {successMessage && (
        <div className="p-4 text-center rounded-lg my-4 bg-green-200 text-green-800 shadow-md">
          {successMessage}
        </div>
      )}

      {/* Gráficos */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <GraphCard
          colorStart="from-red-500"
          colorEnd="to-red-800"
          title="Gastos por Categoria"
        >
          <ExpenseChart transactions={filteredTransactions} />
        </GraphCard>
        <GraphCard
          colorStart="from-blue-500"
          colorEnd="to-blue-800"
          title="Ganhos por Categoria"
        >
          <IncomeChart transactions={filteredTransactions} />
        </GraphCard>
      </div>

      {isModalOpen && (
        <BalanceModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBalance}
          initialBalance={(balance * 100).toString()}
        />
      )}
    </div>
  );
}

export default Dashboard;
