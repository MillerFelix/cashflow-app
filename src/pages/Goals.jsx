import React, { useMemo, useState } from "react";
import Button from "../components/common/Button";
import GoalsModal from "../components/goals/GoalsModal";
import GoalCard from "../components/goals/GoalCard";
import Loader from "../components/common/Loader";
import StatusMessage from "../components/common/StatusMessage";
import { useGoals } from "../hooks/useGoals";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../hooks/useAuth";
import { expenseCategories } from "../components/category/CategoryList";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaBullseye,
  FaChartPie,
  FaPlus,
  FaInfoCircle,
} from "react-icons/fa";

function Goals() {
  const user = useAuth();
  const userId = user?.uid;

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

  // 1. Definição do que é "Custo de Vida Essencial"
  const essentialCategories = useMemo(
    () => [
      "Moradia",
      "Alimentação",
      "Mercado", // Adicionei Mercado explicitamente se não tiver em Alimentação
      "Transporte",
      "Saúde",
      "Seguros",
      "Impostos e Taxas",
      "Educação", // Educação costuma ser essencial
      "Serviços", // Água, Luz, Internet
    ],
    [],
  );

  // 2. O Cérebro do Raio-X Financeiro (CORRIGIDO E INTELIGENTE)
  const { costOfLiving, emergencyFund, totalIncome } = useMemo(() => {
    if (!transactions.length)
      return { costOfLiving: 0, emergencyFund: 0, totalIncome: 0 };

    // Agrupamento por mês para calcular média
    const expensesByMonth = {};
    let totalIncomeCalc = 0;

    // Data atual para referência
    const currentMonthPrefix = new Date().toISOString().slice(0, 7);

    transactions.forEach((t) => {
      // Ignora Pagamento de Fatura para não duplicar (já conta os gastos individuais do cartão)
      if (t.category === "Pagamento de Cartão") return;

      const monthKey = t.date.slice(0, 7); // "2024-03"

      if (t.type === "debit" && essentialCategories.includes(t.category)) {
        expensesByMonth[monthKey] = (expensesByMonth[monthKey] || 0) + t.value;
      }

      // Calcula renda apenas do mês ATUAL para mostrar a porcentagem de comprometimento correta hoje
      if (t.type === "credit" && t.date.startsWith(currentMonthPrefix)) {
        totalIncomeCalc += t.value;
      }
    });

    // Cálculo da Média Mensal de Custo de Vida
    const months = Object.keys(expensesByMonth);
    const numberOfMonths = months.length || 1;
    const totalEssentialExpenses = Object.values(expensesByMonth).reduce(
      (a, b) => a + b,
      0,
    );

    const averageEssentialCost = totalEssentialExpenses / numberOfMonths;

    return {
      costOfLiving: averageEssentialCost, // Agora é a MÉDIA, não o pico do mês
      emergencyFund: averageEssentialCost * 6, // 6 meses da média
      totalIncome: totalIncomeCalc,
    };
  }, [transactions, essentialCategories]);

  // 3. Separa as Metas
  const { budgets, lifeGoals } = useMemo(() => {
    const expenseNames = expenseCategories.map((c) => c.name);

    return {
      budgets: goals.filter(
        (g) =>
          g.type === "expense" ||
          (!g.type && expenseNames.includes(g.category)),
      ),
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
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans text-gray-800 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Planejamento
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Organize suas despesas e conquiste seus sonhos.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <FaPlus size={12} /> Novo Planejamento
          </button>
        </div>

        <StatusMessage message={successMessage} />

        {/* ==========================================
            PILARES 1 E 2: RAIO-X FINANCEIRO
           ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Custo de Vida (Clean Style) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden group hover:border-red-200 transition-colors">
            {/* Icone de Fundo */}
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <FaHeartbeat className="text-8xl text-red-600" />
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaHeartbeat className="text-red-500" /> Custo de Vida Essencial
              (Média)
            </h3>

            <p className="text-3xl font-black text-gray-900 mb-1 relative z-10">
              {formatCurrency(costOfLiving)}
            </p>

            <div className="text-sm text-gray-500 leading-snug relative z-10">
              Média mensal gasta com itens básicos (Moradia, Saúde, etc).
              {totalIncome > 0 && (
                <div className="mt-3 inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-lg text-xs font-bold">
                  <FaInfoCircle />
                  Compromete {Math.round((costOfLiving / totalIncome) * 100)}%
                  da renda atual
                </div>
              )}
            </div>
          </div>

          {/* Card: Reserva de Emergência (Estilo Escudo Azulado) */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden flex flex-col justify-between group">
            {/* O Escudinho de Fundo (Grande e Translúcido) */}
            <div className="absolute -right-6 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none transform rotate-12">
              <FaShieldAlt className="text-9xl text-white" />
            </div>

            <div className="relative z-10">
              <h3 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FaShieldAlt className="text-blue-300" /> Reserva Ideal (6
                Meses)
              </h3>
              <p className="text-3xl font-black text-white tracking-tight">
                {formatCurrency(emergencyFund)}
              </p>
            </div>

            <p className="text-xs text-blue-100/80 mt-4 leading-relaxed max-w-sm relative z-10 font-medium">
              Este é o valor recomendado para guardar e ter segurança total
              baseada no seu padrão de vida médio.
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="py-10 flex justify-center">
            <Loader />
          </div>
        )}

        {/* ==========================================
            PILAR 3: ORÇAMENTO (Controle)
           ========================================== */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2 mt-4">
            <FaChartPie className="text-blue-500" />
            Orçamento Mensal
          </h2>

          {budgets.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
              <p className="text-gray-400 text-sm">
                Defina limites para suas categorias (ex: Lazer, Mercado) para
                controlar gastos.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 text-blue-600 font-bold text-sm hover:underline"
              >
                Criar Limite
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
              ))}
            </div>
          )}
        </div>

        {/* ==========================================
            PILAR 4: OBJETIVOS DE VIDA (Sonhos)
           ========================================== */}
        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2 mt-4">
            <FaBullseye className="text-purple-500" />
            Objetivos de Vida
          </h2>

          {lifeGoals.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
              <p className="text-gray-400 text-sm">
                Qual o seu próximo objetivo ou sonho? Carro novo? Viagem? Comece
                a planejar.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 text-purple-600 font-bold text-sm hover:underline"
              >
                Criar Objetivo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lifeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} />
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <GoalsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={addGoal}
          newGoal={newGoal}
          handleGoalChange={handleGoalChange}
          existingGoals={goals}
        />
      </div>
    </div>
  );
}

export default Goals;
