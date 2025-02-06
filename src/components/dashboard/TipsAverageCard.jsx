import TipCarousel from "./TipCarousel";
import { generateTips } from "./FinancialTips";

const TipsAverageCard = ({ accountBalance, sumCredit, sumDebit }) => {
  const balance = sumCredit - sumDebit;

  const formattedBalance = balance.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const tips = generateTips(accountBalance, sumCredit, sumDebit);
  console.log(tips);
  return (
    <div className="w-full sm:w-[95%] lg:w-[80%] bg-gradient-to-r from-teal-500 to-teal-800 text-white p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row items-center justify-between">
      <div className="flex flex-col items-start lg:items-center lg:mr-4">
        <h2 className="text-lg font-bold">Balanço (Gastos / Ganhos)</h2>
        <p className="text-3xl font-semibold">{formattedBalance}</p>
        <div className="mt-2 flex items-center gap-2 text-sm opacity-90"></div>
      </div>

      {/* Carrossel de Dicas */}
      <TipCarousel tips={tips} />
    </div>
  );
};

export default TipsAverageCard;
