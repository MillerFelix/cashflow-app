import { FaSmile, FaExclamationTriangle, FaFrown, FaMeh } from "react-icons/fa";
import TipCarousel from "./TipCarousel"; // Importando o novo componente de carrossel
import { getBalanceInfo, generateTips } from "./FinancialTips"; // Importando as funções de conselhos

const TipsAverageCard = ({ balanceSheet, sumCredit, sumDebit }) => {
  // Calcular o balanço final: créditos menos débitos
  const balance = sumCredit - sumDebit;

  // Formatar o balanço como moeda
  const formattedBalance = balance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Usar a função para obter a informação do saldo
  const { message, icon } = getBalanceInfo(balance, balanceSheet);

  // Gerar conselhos baseados no saldo
  const tips = generateTips(balance, balanceSheet);

  return (
    <div className="w-full sm:w-[95%] lg:w-[80%] bg-gradient-to-r from-teal-500 to-teal-800 text-white p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row items-center justify-between">
      <div className="flex flex-col items-start lg:items-center lg:mr-4">
        <h2 className="text-lg font-bold">Balanço (Gastos / Ganhos)</h2>
        <p className="text-3xl font-semibold">{formattedBalance}</p>
        <div className="mt-2 flex items-center gap-2 text-sm opacity-90">
          {icon === "frown" && <FaFrown size={24} className="text-red-400" />}
          {icon === "meh" && <FaMeh size={24} className="text-yellow-300" />}
          {icon === "exclamation-triangle" && (
            <FaExclamationTriangle size={24} className="text-yellow-500" />
          )}
          {icon === "smile" && <FaSmile size={24} className="text-green-300" />}
        </div>
      </div>

      {/* Carrossel de Dicas */}
      <TipCarousel tips={tips} />
    </div>
  );
};

export default TipsAverageCard;
