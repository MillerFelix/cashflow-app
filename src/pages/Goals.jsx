import React, { useMemo, useState } from "react";
import Button from "../components/common/Button";
import GoalsModal from "../components/goals/GoalsModal";
import GoalCard from "../components/goals/GoalCard";
import Loader from "../components/common/Loader";
import StatusMessage from "../components/common/StatusMessage";
import { useGoals } from "../hooks/useGoals";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import {
  expenseCategories,
  incomeCategories,
} from "../components/category/CategoryList";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaBullseye,
  FaChartPie,
  FaPlus,
} from "react-icons/fa";

function Goals() {
  const user = useAuth();
  const userId = user?.uid;

  // Trazemos as metas e as transações para cruzar os dados de inteligência
  const {
    goals,
    isLoading,
    successMessage,
    deleteGoal,
    newGoal,
    handleGoalChange,
    addGoal,
  } = useGoals();
  const { transactions } = useTransactions(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Definição do que é "Custo de Vida Essencial" (Sobrevivência)
  const essentialCategories = useMemo(
    () => [
      "Moradia",
      "Alimentação",
      "Transporte",
      "Saúde",
      "Seguros",
      "Impostos e Taxas",
    ],
    [],
  );

  // 2. O Cérebro do Raio-X Financeiro (Pilares 1 e 2)
  const { costOfLiving, emergencyFund, totalIncome } = useMemo(() => {
    const currentMonthPrefix = new Date().toISOString().slice(0, 7); // Ex: "2026-05"

    let cost = 0;
    let income = 0;

    transactions.forEach((t) => {
      // Analisa apenas o mês corrente
      if (t.date.startsWith(currentMonthPrefix)) {
        if (t.type === "debit" && essentialCategories.includes(t.category)) {
          cost += t.value;
        }
        if (t.type === "credit") {
          income += t.value;
        }
      }
    });

    return {
      costOfLiving: cost,
      emergencyFund: cost * 6, // 6 meses do custo de vida atual
      totalIncome: income,
    };
  }, [transactions, essentialCategories]);

  // 3. Separa as Metas em "Orçamento de Gastos" e "Objetivos de Vida"
  const { budgets, lifeGoals } = useMemo(() => {
    const expenseNames = expenseCategories.map((c) => c.name);

    return {
      // É orçamento se tiver o tipo "expense", ou se for antigo e o nome for de uma despesa
      budgets: goals.filter(
        (g) =>
          g.type === "expense" ||
          (!g.type && expenseNames.includes(g.category)),
      ),
      // É objetivo de vida se tiver o tipo "life", ou se for antigo e não for despesa
      lifeGoals: goals.filter(
        (g) =>
          g.type === "life" || (!g.type && !expenseNames.includes(g.category)),
      ),
    };
  }, [goals]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      {/* Cabeçalho */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <FaBullseye className="text-blue-600" />
            Planejamento Inteligente
          </h1>
          <p className="text-gray-600 mt-1">
            Seu GPS financeiro para organizar o presente e garantir o futuro.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          bgColor="bg-blue-600"
          hoverColor="hover:bg-blue-700"
          className="text-white font-bold flex items-center gap-2 shadow-lg"
        >
          <FaPlus /> Novo Planejamento
        </Button>
      </div>
      <StatusMessage message={successMessage} />
      {/* ==========================================
          PILARES 1 E 2: RAIO-X FINANCEIRO
      ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Card: Custo de Vida */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500 relative overflow-hidden transition-transform hover:scale-[1.01]">
          <FaHeartbeat className="absolute -right-4 -bottom-4 text-8xl text-red-50 opacity-50" />
          <h3 className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-1">
            Custo de Vida Essencial (Mês Atual)
          </h3>
          <p className="text-3xl font-extrabold text-gray-800">
            {formatCurrency(costOfLiving)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Valor mínimo para manter Moradia, Alimentação, Saúde e Transporte.
            {totalIncome > 0 && (
              <span className="block mt-1 text-xs font-semibold text-gray-400">
                Compromete {Math.round((costOfLiving / totalIncome) * 100)}% das
                suas receitas atuais.
              </span>
            )}
          </p>
        </div>

        {/* Card: Reserva Mestra */}
        <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-2xl shadow-md border-l-4 border-yellow-400 relative overflow-hidden transition-transform hover:scale-[1.01]">
          <FaShieldAlt className="absolute -right-4 -bottom-4 text-8xl text-gray-700 opacity-30" />
          <h3 className="text-gray-400 uppercase font-bold text-xs tracking-wider mb-1">
            Reserva de Emergência Ideal (6 Meses)
          </h3>
          <p className="text-3xl font-extrabold text-yellow-400">
            {formatCurrency(emergencyFund)}
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Baseado no seu custo de vida atual, este é o valor que você deve ter
            guardado para imprevistos.
          </p>
        </div>
      </div>
      {isLoading && <Loader />}
      {/* ==========================================
          PILAR 3: ORÇAMENTO (Controle de Gastos)
      ========================================== */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <FaChartPie className="text-red-500" />
          Orçamento Mensal (Freio de Gastos)
        </h2>
        {budgets.length === 0 ? (
          <p className="text-gray-500 italic bg-white p-4 rounded-lg border border-dashed border-gray-300">
            Você ainda não definiu limites para suas despesas variáveis. Crie um
            planejamento para controlar seus gastos.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
            ))}
          </div>
        )}
      </div>
      {/* ==========================================
          PILAR 4: OBJETIVOS DE VIDA (Acelerador)
      ========================================== */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <FaBullseye className="text-green-600" />
          Objetivos de Vida (Crescimento)
        </h2>
        {lifeGoals.length === 0 ? (
          <p className="text-gray-500 italic bg-white p-4 rounded-lg border border-dashed border-gray-300">
            Qual o seu próximo grande sonho? Defina objetivos para começar a
            investir o seu dinheiro.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lifeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
            ))}
          </div>
        )}
      </div>
      {/* Modal Reutilizável de Criação */}
      <GoalsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addGoal}
        newGoal={newGoal}
        handleGoalChange={handleGoalChange}
        existingGoals={goals}
      />{" "}
    </div>
  );
}

export default Goals;
