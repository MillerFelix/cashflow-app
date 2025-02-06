import {
  FaSmile,
  FaExclamationTriangle,
  FaFrown,
  FaMeh,
  FaMoneyBillAlt,
  FaCalendarCheck,
  FaArrowCircleDown,
  FaRegThumbsUp,
} from "react-icons/fa";
import React from "react";

// Função para definir a mensagem do balanço
export const getBalanceInfo = (balance, balanceSheet) => {
  if (balance < 0) {
    return {
      message: "Cuidado! Você gastou mais do que tem.",
      icon: <FaFrown size={24} className="text-red-400" />,
    };
  }
  if (balance === 0) {
    return {
      message: "Seu saldo está zerado. Planeje-se!",
      icon: <FaMeh size={24} className="text-yellow-300" />,
    };
  }
  if (balance < 0.2 * balanceSheet) {
    return {
      message: "Seu saldo está baixo. Controle seus gastos!",
      icon: <FaExclamationTriangle size={24} className="text-yellow-500" />,
    };
  }
  return {
    message: "Seu saldo está saudável. Continue assim!",
    icon: <FaSmile size={24} className="text-green-300" />,
  };
};

// Função para gerar dicas baseadas no balanço
export const generateTips = (balance, balanceSheet) => {
  const tips = {
    negative: [
      {
        tip: "Evite compras por impulso. Reavalie seus gastos!",
        icon: <FaArrowCircleDown size={24} className="text-red-500" />,
      },
      {
        tip: "Reduza despesas essenciais para equilibrar o orçamento.",
        icon: <FaMoneyBillAlt size={24} className="text-orange-500" />,
      },
      {
        tip: "Busque fontes extras de renda para melhorar seu saldo.",
        icon: <FaCalendarCheck size={24} className="text-blue-500" />,
      },
    ],
    zero: [
      {
        tip: "Saldo zerado, foque nas despesas essenciais.",
        icon: <FaExclamationTriangle size={24} className="text-yellow-500" />,
      },
      {
        tip: "Procure rendimentos temporários até equilibrar sua conta.",
        icon: <FaArrowCircleDown size={24} className="text-orange-600" />,
      },
      {
        tip: "Revise seu orçamento e defina prioridades para o próximo mês.",
        icon: <FaRegThumbsUp size={24} className="text-green-400" />,
      },
    ],
    lowBalance: [
      {
        tip: "Evite gastos extras e controle seu orçamento!",
        icon: <FaMoneyBillAlt size={24} className="text-red-400" />,
      },
      {
        tip: "Reveja seus hábitos de consumo, foque em economizar.",
        icon: <FaCalendarCheck size={24} className="text-yellow-400" />,
      },
      {
        tip: "Crie uma meta de poupança para melhorar seu saldo.",
        icon: <FaSmile size={24} className="text-green-500" />,
      },
    ],
    healthyBalance: [
      {
        tip: "Continue assim! Invista sua sobra para o futuro.",
        icon: <FaRegThumbsUp size={24} className="text-green-500" />,
      },
      {
        tip: "Saldo equilibrado! Hora de poupar para o longo prazo.",
        icon: <FaMoneyBillAlt size={24} className="text-blue-400" />,
      },
      {
        tip: "Excelente! Considere investimentos para aumentar seu patrimônio.",
        icon: <FaArrowCircleDown size={24} className="text-teal-500" />,
      },
    ],
  };

  // Retorna as dicas com base no balanço
  if (balance < 0) return tips.negative;
  if (balance === 0) return tips.zero;
  if (balance < 0.2 * balanceSheet) return tips.lowBalance;
  return tips.healthyBalance;
};
