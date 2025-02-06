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

// Função para gerar dicas inteligentes
export const generateTips = (accountBalance, sumCredit, sumDebit) => {
  // Converte o saldo para número, removendo "R$" e formatando corretamente
  const numericBalance = Number(
    accountBalance.replace(/[^\d,-]/g, "").replace(",", ".")
  );

  console.log("Valores recebidos:", { numericBalance, sumCredit, sumDebit });

  const balance = sumCredit - sumDebit;
  console.log("Balanço calculado:", balance);

  // Calcula porcentagem dos gastos em relação aos ganhos
  const spendingPercentage = sumDebit > 0 ? (sumDebit / sumCredit) * 100 : 0;

  const tips = [];

  // Dicas baseadas no saldo
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

  if (numericBalance < 0.2 * sumCredit) {
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

  // 🔥 Dicas adicionais baseadas na porcentagem de gastos 🔥
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
  } else if (spendingPercentage < 50) {
    tips.push({
      tip: "Parabéns! Você está conseguindo guardar uma boa parte da sua renda. Que tal investir esse dinheiro?",
      icon: <FaChartLine size={24} className="text-green-500" />,
    });
  }

  // 🔥 Dicas de finanças gerais 🔥
  const generalTips = [
    {
      tip: "Investir em sua educação financeira é uma das melhores decisões que você pode tomar. Procure entender como o dinheiro funciona e como investir com inteligência.",
      icon: <FaBook size={24} className="text-blue-500" />,
    },
    {
      tip: "Estabeleça uma reserva de emergência antes de qualquer outra coisa. Ela vai te ajudar a enfrentar imprevistos sem entrar no vermelho.",
      icon: <FaPiggyBank size={24} className="text-green-500" />,
    },
    {
      tip: "Revise suas despesas fixas mensalmente. Muitas vezes, assinaturas e serviços desnecessários podem ser cortados sem impacto no seu estilo de vida.",
      icon: <FaMoneyBillAlt size={24} className="text-blue-500" />,
    },
    {
      tip: "Evite compras por impulso. Use a regra dos 30 dias: se você sentir vontade de comprar algo, espere 30 dias antes de tomar a decisão.",
      icon: <FaExclamationTriangle size={24} className="text-yellow-500" />,
    },
    {
      tip: "Faça orçamentos mensais! Saber quanto você ganha e quanto pode gastar é essencial para manter as finanças sob controle.",
      icon: <FaChartLine size={24} className="text-green-500" />,
    },
    {
      tip: "O poder dos juros compostos é incrível! Comece a investir o quanto antes, mesmo que seja uma pequena quantia. Isso faz uma grande diferença a longo prazo.",
      icon: <FaPiggyBank size={24} className="text-green-500" />,
    },
    {
      tip: "Mantenha uma visão clara de suas dívidas. Conhecer o montante e as taxas de juros de cada uma te ajudará a definir um plano de pagamento eficaz.",
      icon: <FaExclamationTriangle size={24} className="text-red-500" />,
    },
    {
      tip: "Se você tem dívidas com juros altos, priorize pagá-las o mais rápido possível. Isso pode economizar muito dinheiro a longo prazo.",
      icon: <FaArrowCircleDown size={24} className="text-red-500" />,
    },
    {
      tip: "Mantenha seus investimentos diversificados. Isso reduz o risco e aumenta suas chances de sucesso financeiro a longo prazo.",
      icon: <FaRegThumbsUp size={24} className="text-green-400" />,
    },
    {
      tip: "Faça uma revisão anual do seu planejamento financeiro. O que funcionou? O que pode ser melhorado? Essa reflexão é essencial para ajustar suas metas.",
      icon: <FaChartLine size={24} className="text-blue-500" />,
    },
    {
      tip: "Sempre tenha uma meta clara para seus investimentos. Defina objetivos específicos para saber onde aplicar seu dinheiro de maneira mais eficiente.",
      icon: <FaRegThumbsUp size={24} className="text-green-400" />,
    },
    {
      tip: "Economize em energia e água. Pequenos hábitos diários de economia podem reduzir significativamente suas despesas mensais.",
      icon: <FaMoneyBillAlt size={24} className="text-green-500" />,
    },
    {
      tip: "Tente gerar uma fonte extra de renda, seja um projeto paralelo ou um trabalho freelancer. Isso ajuda a aumentar sua segurança financeira.",
      icon: <FaSmile size={24} className="text-green-500" />,
    },
    {
      tip: "Nunca coloque todos os ovos na mesma cesta! A diversificação é uma estratégia importante não apenas em investimentos, mas também em fontes de renda.",
      icon: <FaPiggyBank size={24} className="text-green-500" />,
    },
    {
      tip: "Aposte no controle emocional nas suas finanças. Impulsos de compra podem arruinar seu planejamento financeiro. Pense antes de agir!",
      icon: <FaExclamationTriangle size={24} className="text-yellow-500" />,
    },
    {
      tip: "Siga uma regra simples: pague primeiro a você mesmo. Isso significa poupar antes de gastar, e não o contrário.",
      icon: <FaMoneyBillAlt size={24} className="text-green-500" />,
    },
    {
      tip: "Aprenda sobre fundos de emergência e invista em algo que te proteja em caso de perda de renda ou emergências inesperadas.",
      icon: <FaPiggyBank size={24} className="text-green-500" />,
    },
    {
      tip: "Lembre-se de que um bom planejamento financeiro não é só para quem tem muito dinheiro, mas para qualquer pessoa que quer melhorar sua relação com o dinheiro.",
      icon: <FaRegThumbsUp size={24} className="text-blue-500" />,
    },
    {
      tip: "Compreenda a diferença entre ativos e passivos. Aumentar ativos e reduzir passivos pode acelerar sua independência financeira.",
      icon: <FaChartLine size={24} className="text-green-500" />,
    },
    {
      tip: "Não ignore os pequenos gastos. Eles somam muito mais do que você imagina no final do mês. Tente sempre revisar seus extratos de conta.",
      icon: <FaMoneyBillAlt size={24} className="text-yellow-500" />,
    },
  ];

  // Seleciona 2 dicas gerais aleatórias
  const randomGeneralTips = generalTips
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  // Limita o número total de dicas para 4
  const finalTips = [...tips.slice(0, 2), ...randomGeneralTips].slice(0, 4);

  console.log("Dicas geradas:", finalTips);
  return finalTips;
};
