import React from "react";
import {
  FaHome,
  FaUtensils,
  FaCar,
  FaHeartbeat,
  FaGamepad,
  FaGraduationCap,
  FaShoppingCart,
  FaPlane,
  FaTshirt,
  FaHammer,
  FaGift,
  FaBriefcase,
  FaMoneyBillWave,
  FaChartLine,
  FaPiggyBank,
  FaExchangeAlt,
  FaCreditCard,
} from "react-icons/fa";

export const expenseCategories = [
  { name: "Moradia", icon: <FaHome />, color: "bg-blue-500" },
  { name: "Alimentação", icon: <FaUtensils />, color: "bg-orange-500" },
  { name: "Transporte", icon: <FaCar />, color: "bg-gray-500" },
  { name: "Saúde", icon: <FaHeartbeat />, color: "bg-red-500" },
  { name: "Lazer", icon: <FaGamepad />, color: "bg-purple-500" },
  { name: "Educação", icon: <FaGraduationCap />, color: "bg-yellow-500" },
  { name: "Mercado", icon: <FaShoppingCart />, color: "bg-green-500" },
  { name: "Viagem", icon: <FaPlane />, color: "bg-cyan-500" },
  { name: "Vestuário", icon: <FaTshirt />, color: "bg-pink-500" },
  { name: "Serviços", icon: <FaHammer />, color: "bg-indigo-500" },
  { name: "Presentes", icon: <FaGift />, color: "bg-rose-500" },
  {
    name: "Pagamento de Cartão",
    icon: <FaCreditCard />,
    color: "bg-slate-700",
  },
  { name: "Outros Gastos", icon: <FaExchangeAlt />, color: "bg-slate-500" },
];

export const incomeCategories = [
  { name: "Salário", icon: <FaBriefcase />, color: "bg-green-600" },
  { name: "Freelance", icon: <FaMoneyBillWave />, color: "bg-emerald-500" },
  { name: "Investimentos", icon: <FaChartLine />, color: "bg-blue-600" },
  { name: "Presente", icon: <FaGift />, color: "bg-purple-500" },
  { name: "Outros Ganhos", icon: <FaPiggyBank />, color: "bg-teal-500" },
];

/**
 * Componente CategoryList
 * Renderiza um Grid visual com todas as categorias disponíveis para o usuário selecionar.
 * Utilizado principalmente nas telas de configuração de Metas ou Filtros avançados.
 */
function CategoryList({ selectedCategory, handleCategorySelect }) {
  return (
    <div className="space-y-6 mt-6">
      {/* Seção: Despesas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Despesas</h3>
        {/* Grid responsivo: 3 colunas no celular, 4 em telas médias, 6 em telas grandes */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {expenseCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategorySelect(category)}
              className={`flex flex-col items-center p-3 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105
                ${
                  selectedCategory === category.name
                    ? "bg-red-500 text-white" // Destaque para despesa selecionada
                    : "bg-gray-100 hover:bg-gray-200"
                } 
              `}
            >
              <div className="text-2xl">{category.icon}</div>
              <p className="mt-2 text-xs text-center">{category.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seção: Ganhos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Ganhos</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {incomeCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategorySelect(category)}
              className={`flex flex-col items-center p-3 rounded-lg shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105
                ${
                  selectedCategory === category.name
                    ? "bg-green-500 text-white" // Destaque para ganho selecionado
                    : "bg-gray-100 hover:bg-gray-200"
                } 
              `}
            >
              <div className="text-2xl">{category.icon}</div>
              <p className="mt-2 text-xs text-center">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CategoryList);
