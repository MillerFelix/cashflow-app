import React from "react";
import {
  FaSmile,
  FaExclamationTriangle,
  FaMoneyBillAlt,
  FaRegThumbsUp,
  FaPiggyBank,
  FaChartLine,
  FaBook,
  FaChartPie,
} from "react-icons/fa";

/**
 * Função utilitária: generateTips
 * Agora analisa as transações reais do usuário para gerar Insights Dinâmicos!
 */
export const generateTips = (
  accountBalance,
  sumCredit,
  sumDebit,
  transactions = [],
) => {
  const tips = [];

  // --- REGRA 1: Gastos maiores que ganhos (Alerta de Risco) ---
  if (sumDebit > sumCredit && sumCredit > 0) {
    tips.push({
      tip: "Atenção! Este mês você já gastou mais do que ganhou. Pise no freio para não fechar no vermelho!",
      icon: <FaExclamationTriangle size={24} className="text-red-500" />,
    });
  }

  // --- REGRA 2: Economia maior que 20% (Elogio e Investimento) ---
  const savings = sumCredit - sumDebit;
  if (sumCredit > 0 && savings >= sumCredit * 0.2) {
    tips.push({
      tip: `Incrível! Você está economizando ${Math.round((savings / sumCredit) * 100)}% da sua renda. Excelente momento para investir esse valor!`,
      icon: <FaChartLine size={24} className="text-green-400" />,
    });
  }

  // --- REGRA 3: Identificar a Categoria Dominante (Aviso de Excesso) ---
  if (transactions.length > 0 && sumDebit > 0) {
    // 3.1 Agrupa os gastos por categoria
    const expensesByCategory = transactions
      .filter((t) => t.type === "debit")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.value;
        return acc;
      }, {});

    // 3.2 Descobre qual categoria gastou mais
    let dominantCategory = "";
    let maxExpense = 0;
    for (const [category, amount] of Object.entries(expensesByCategory)) {
      if (amount > maxExpense) {
        maxExpense = amount;
        dominantCategory = category;
      }
    }

    // 3.3 Se uma única categoria representa mais de 35% de tudo que ele gastou, lança o alerta!
    const dominantPercentage = (maxExpense / sumDebit) * 100;
    if (dominantPercentage > 35) {
      tips.push({
        tip: `Cuidado com a categoria "${dominantCategory}"! Ela sozinha está consumindo ${Math.round(dominantPercentage)}% de todos os seus gastos.`,
        icon: <FaChartPie size={24} className="text-yellow-400" />,
      });
    }
  }

  // Se o usuário ainda não tiver muitas transações para gerar os alertas dinâmicos,
  // nós colocamos algumas dicas gerais para o carrossel nunca ficar vazio.
  const generalTips = [
    {
      tip: "Estabeleça uma reserva de emergência antes de qualquer outra coisa. Ela vai te proteger de imprevistos!",
      icon: <FaPiggyBank size={24} className="text-blue-400" />,
    },
    {
      tip: "Evite compras por impulso. Use a regra dos 30 dias: espere antes de comprar algo que não seja essencial.",
      icon: <FaBook size={24} className="text-blue-400" />,
    },
    {
      tip: "Revise suas despesas fixas. Assinaturas que você não usa são ralos invisíveis de dinheiro!",
      icon: <FaMoneyBillAlt size={24} className="text-blue-400" />,
    },
  ];

  // Mistura as dicas gerais e pega 2
  const randomGeneralTips = generalTips
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  // Combina os Insights Dinâmicos com as Dicas Gerais
  const finalTips = [...tips, ...randomGeneralTips];

  // Retorna no máximo 4 dicas para não poluir o carrossel
  return finalTips.slice(0, 4);
};
