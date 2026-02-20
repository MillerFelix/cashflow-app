import React, { useMemo } from "react";
import { FaCalendarAlt, FaMagic } from "react-icons/fa";

/**
 * Componente FutureBalanceCard (Projeção de Saldo Futuro)
 * Calcula quanto dinheiro o utilizador terá no final do mês,
 * somando as receitas previstas e subtraindo as despesas previstas que ainda não venceram.
 */
function FutureBalanceCard({ currentBalance, transactions }) {
  const { projectedBalance, futureIncome, futureExpense } = useMemo(() => {
    // 1. Descobre a data de hoje no formato YYYY-MM-DD (de acordo com o fuso horário local)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayStr = `${year}-${month}-${day}`;
    const currentMonthPrefix = `${year}-${month}`; // Ex: "2026-02"

    let fIncome = 0;
    let fExpense = 0;

    // 2. Varre as transações procurando as que vencem no futuro (neste mês)
    transactions.forEach((t) => {
      // Verifica se a transação é DESTE mês, mas num dia DEPOIS de hoje
      if (t.date.startsWith(currentMonthPrefix) && t.date > todayStr) {
        if (t.type === "credit") fIncome += t.value;
        if (t.type === "debit") fExpense += t.value;
      }
    });

    // 3. A Matemática da Previsão
    const projBalance = currentBalance + fIncome - fExpense;

    return {
      projectedBalance: projBalance,
      futureIncome: fIncome,
      futureExpense: fExpense,
    };
  }, [currentBalance, transactions]);

  // Se não houver transações futuras neste mês, não precisamos mostrar o card
  if (futureIncome === 0 && futureExpense === 0) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-800 text-white p-6 rounded-xl shadow-lg w-full transition-transform hover:scale-[1.01] mt-6 relative overflow-hidden">
      {/* Efeito de brilho de fundo */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>

      <div className="flex items-center gap-3 mb-4">
        <FaMagic className="text-yellow-300 text-xl animate-pulse" />
        <h3 className="text-lg font-bold tracking-wide">
          Projeção para o Fim do Mês
        </h3>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-indigo-200 text-sm">Saldo Previsto</p>
          <p
            className={`text-3xl font-extrabold mt-1 ${projectedBalance < 0 ? "text-red-300" : "text-white"}`}
          >
            {projectedBalance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </div>

        <div className="flex gap-4 bg-black bg-opacity-20 p-3 rounded-lg w-full md:w-auto justify-around">
          <div className="text-center">
            <p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">
              A Receber
            </p>
            <p className="text-green-300 font-bold text-sm">
              +{" "}
              {futureIncome.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
          <div className="w-px bg-indigo-400 opacity-50"></div>
          <div className="text-center">
            <p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">
              A Pagar
            </p>
            <p className="text-red-300 font-bold text-sm">
              -{" "}
              {futureExpense.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(FutureBalanceCard);
