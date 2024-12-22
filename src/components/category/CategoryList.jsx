import {
  FaHome,
  FaUtensils,
  FaCar,
  FaHeartbeat,
  FaBook,
  FaTheaterMasks,
  FaTshirt,
  FaShieldAlt,
  FaPiggyBank,
  FaFileInvoiceDollar,
  FaEllipsisH,
  FaMoneyBillWave,
  FaBriefcase,
  FaChartLine,
  FaHandHoldingUsd,
  FaBuilding,
  FaGift,
  FaPlusCircle,
} from "react-icons/fa";

export const expenseCategories = [
  { name: "Moradia", icon: <FaHome /> },
  { name: "Alimentação", icon: <FaUtensils /> },
  { name: "Transporte", icon: <FaCar /> },
  { name: "Saúde", icon: <FaHeartbeat /> },
  { name: "Educação", icon: <FaBook /> },
  { name: "Lazer e Entretenimento", icon: <FaTheaterMasks /> },
  { name: "Roupas e Acessórios", icon: <FaTshirt /> },
  { name: "Seguros", icon: <FaShieldAlt /> },
  { name: "Finanças e Investimentos", icon: <FaPiggyBank /> },
  { name: "Impostos e Taxas", icon: <FaFileInvoiceDollar /> },
  { name: "Outras Despesas", icon: <FaEllipsisH /> },
];

export const incomeCategories = [
  { name: "Salário", icon: <FaMoneyBillWave /> },
  { name: "Freelance e Renda Extra", icon: <FaBriefcase /> },
  { name: "Investimentos", icon: <FaChartLine /> },
  { name: "Recebimento de Empréstimos", icon: <FaHandHoldingUsd /> },
  { name: "Renda de Aluguéis", icon: <FaBuilding /> },
  { name: "Doações e Presentes", icon: <FaGift /> },
  { name: "Outros Ganhos", icon: <FaPlusCircle /> },
];

function CategoryList() {
  return (
    <div className="space-y-6 mt-6">
      {/* Despesas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Despesas</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {expenseCategories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-2 bg-red-100 rounded-lg shadow-sm hover:bg-red-200 transition duration-200 ease-in-out"
            >
              <div className="text-2xl text-red-600">{category.icon}</div>
              <p className="mt-1 text-xs text-center text-gray-700">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ganhos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Ganhos</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {incomeCategories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-2 bg-green-100 rounded-lg shadow-sm hover:bg-green-200 transition duration-200 ease-in-out"
            >
              <div className="text-2xl text-green-600">{category.icon}</div>
              <p className="mt-1 text-xs text-center text-gray-700">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryList;
