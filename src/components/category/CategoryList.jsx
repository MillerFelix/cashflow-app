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

// Adicionei a chave "type" para definir se é uma categoria de "despesa" ou "ganho"
export const expenseCategories = [
  { name: "Moradia", icon: <FaHome />, type: "expense" },
  { name: "Alimentação", icon: <FaUtensils />, type: "expense" },
  { name: "Transporte", icon: <FaCar />, type: "expense" },
  { name: "Saúde", icon: <FaHeartbeat />, type: "expense" },
  { name: "Educação", icon: <FaBook />, type: "expense" },
  { name: "Lazer e Entretenimento", icon: <FaTheaterMasks />, type: "expense" },
  { name: "Roupas e Acessórios", icon: <FaTshirt />, type: "expense" },
  { name: "Seguros", icon: <FaShieldAlt />, type: "expense" },
  { name: "Finanças e Investimentos", icon: <FaPiggyBank />, type: "expense" },
  { name: "Impostos e Taxas", icon: <FaFileInvoiceDollar />, type: "expense" },
  { name: "Outras Despesas", icon: <FaEllipsisH />, type: "expense" },
];

export const incomeCategories = [
  { name: "Salário", icon: <FaMoneyBillWave />, type: "income" },
  { name: "Freelance e Renda Extra", icon: <FaBriefcase />, type: "income" },
  { name: "Investimentos", icon: <FaChartLine />, type: "income" },
  {
    name: "Recebimento de Empréstimos",
    icon: <FaHandHoldingUsd />,
    type: "income",
  },
  { name: "Renda de Aluguéis", icon: <FaBuilding />, type: "income" },
  { name: "Doações e Presentes", icon: <FaGift />, type: "income" },
  { name: "Outros Ganhos", icon: <FaPlusCircle />, type: "income" },
];

function CategoryList({ selectedCategory, handleCategorySelect }) {
  return (
    <div className="space-y-6 mt-6">
      {/* Despesas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Despesas</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {expenseCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategorySelect(category)}
              className={`flex flex-col items-center p-3 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out 
                ${
                  selectedCategory === category.name
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } 
                transform hover:scale-105`}
            >
              <div className="text-2xl">{category.icon}</div>
              <p className="mt-2 text-xs text-center text-gray-700">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Ganhos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Ganhos</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {incomeCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategorySelect(category)}
              className={`flex flex-col items-center p-3 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out 
                ${
                  selectedCategory === category.name
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                } 
                transform hover:scale-105`}
            >
              <div className="text-2xl">{category.icon}</div>
              <p className="mt-2 text-xs text-center text-gray-700">
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
