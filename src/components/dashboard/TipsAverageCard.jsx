import React, { useMemo } from "react";
import TipCarousel from "./TipCarousel";
import { generateTips } from "./FinancialTips";

/**
 * Componente TipsAverageCard
 * Exibe o balanço geral e os Insights Dinâmicos gerados a partir das transações.
 */
// 1. Recebemos a prop 'transactions' aqui
const TipsAverageCard = ({
  accountBalance,
  sumCredit,
  sumDebit,
  transactions,
}) => {
  const balance = useMemo(() => sumCredit - sumDebit, [sumCredit, sumDebit]);

  const formattedBalance = balance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // 2. Passamos 'transactions' para a função geradora e para o array de dependências do useMemo
  const tips = useMemo(
    () => generateTips(accountBalance, sumCredit, sumDebit, transactions),
    [accountBalance, sumCredit, sumDebit, transactions],
  );

  return (
    <div className="w-full sm:w-[95%] lg:w-[80%] bg-gradient-to-r from-teal-500 to-teal-800 text-white p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row items-center justify-between transition-transform hover:scale-[1.01]">
      <div className="flex flex-col items-start lg:items-center lg:mr-4 mb-4 lg:mb-0">
        <h2 className="text-lg font-bold">Balanço (Ganhos - Gastos)</h2>
        <p className="text-3xl font-semibold">{formattedBalance}</p>
      </div>

      <TipCarousel tips={tips} />
    </div>
  );
};

export default React.memo(TipsAverageCard);
