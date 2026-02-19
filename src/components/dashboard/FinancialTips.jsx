import {
  FaSmile,
  FaExclamationTriangle,
  FaMoneyBillAlt,
  FaArrowCircleDown,
  FaRegThumbsUp,
  FaPiggyBank,
  FaChartLine,
  FaBook,
} from "react-icons/fa";
import React from "react";

/**
 * Função utilitária: generateTips
 * Avalia o cenário financeiro do usuário (Saldo, Ganhos e Gastos)
 * e devolve um array com 4 dicas personalizadas.
 */
export const generateTips = (accountBalance, sumCredit, sumDebit) => {
  // Limpa a string do saldo (ex: "R$ 1.000,00" -> 1000.00)
  const numericBalance = Number(
    accountBalance.replace(/[^\d,-]/g, "").replace(",", "."),
  );

  const balance = sumCredit - sumDebit;
  const spendingPercentage = sumCredit > 0 ? (sumDebit / sumCredit) * 100 : 0;

  const tips = [];

  // --- LÓGICA DE DICAS CONDICIONAIS ---

  if (numericBalance < 0) {
    tips.push({
      tip: "Seu saldo está negativo! É essencial cortar gastos e rever seu orçamento.",
      icon: <FaArrowCircleDown size={24} className="text-red-500" />,
    });

    if (balance > 0) {
      tips.push({
        tip: "Apesar do saldo negativo, você está gastando menos do que ganha. Continue assim para sair do vermelho!",
        icon: <FaRegThumbsUp size={24} className="text-green-400" />,
      });
    } else {
      tips.push({
        tip: "Você está gastando mais do que ganha! Reduza despesas ou aumente sua renda.",
        icon: <FaExclamationTriangle size={24} className="text-yellow-500" />,
      });
    }
  }

  if (numericBalance === 0) {
    tips.push({
      tip: "Seu saldo está zerado. Planeje-se para evitar dívidas!",
      icon: <FaExclamationTriangle size={24} className="text-yellow-400" />,
    });

    if (balance > 0) {
      tips.push({
        tip: "Boa notícia! Você começou a ganhar mais do que gasta. Continue assim!",
        icon: <FaRegThumbsUp size={24} className="text-green-400" />,
      });
    }
  }

  if (numericBalance > 0 && numericBalance < 0.2 * sumCredit) {
    tips.push({
      tip: "Seu saldo está baixo. Considere reduzir gastos supérfluos.",
      icon: <FaMoneyBillAlt size={24} className="text-red-400" />,
    });

    if (balance > 0) {
      tips.push({
        tip: "Você está no caminho certo! Com mais economia, poderá construir uma reserva financeira.",
        icon: <FaSmile size={24} className="text-green-400" />,
      });
    }
  }

  if (numericBalance >= 0.2 * sumCredit) {
    tips.push({
      tip: "Ótimo trabalho! Você tem um saldo positivo, considere investir parte dele.",
      icon: <FaRegThumbsUp size={24} className="text-green-500" />,
    });

    if (balance < 0) {
      tips.push({
        tip: "Apesar do saldo positivo, seus gastos estão altos. Monitore suas despesas para evitar problemas futuros.",
        icon: <FaExclamationTriangle size={24} className="text-yellow-500" />,
      });
    }
  }

  if (spendingPercentage > 90) {
    tips.push({
      tip: "Você está gastando mais de 90% do que ganha! Considere criar uma reserva de emergência.",
      icon: <FaPiggyBank size={24} className="text-red-500" />,
    });
  } else if (spendingPercentage > 70) {
    tips.push({
      tip: "Seus gastos estão altos! Tente economizar pelo menos 30% da sua renda mensal.",
      icon: <FaMoneyBillAlt size={24} className="text-yellow-500" />,
    });
  } else if (spendingPercentage > 0 && spendingPercentage < 50) {
    tips.push({
      tip: "Parabéns! Você está conseguindo guardar uma boa parte da sua renda. Que tal investir esse dinheiro?",
      icon: <FaChartLine size={24} className="text-green-500" />,
    });
  }

  const generalTips = [
    {
      tip: "Investir em sua educação financeira é uma das melhores decisões...",
      icon: <FaBook size={24} className="text-blue-500" />,
    },
    {
      tip: "Estabeleça uma reserva de emergência antes de qualquer outra coisa...",
      icon: <FaPiggyBank size={24} className="text-green-500" />,
    },
    {
      tip: "Revise suas despesas fixas mensalmente...",
      icon: <FaMoneyBillAlt size={24} className="text-blue-500" />,
    },
    {
      tip: "Faça orçamentos mensais! Saber quanto você ganha e quanto pode gastar é essencial...",
      icon: <FaChartLine size={24} className="text-green-500" />,
    },
    {
      tip: "Mantenha seus investimentos diversificados...",
      icon: <FaRegThumbsUp size={24} className="text-green-400" />,
    },
  ];

  // Mistura as dicas gerais e seleciona 2
  const randomGeneralTips = generalTips
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  // Combina até 2 dicas específicas + 2 dicas gerais e devolve 4 no total
  return [...tips.slice(0, 2), ...randomGeneralTips].slice(0, 4);
};
