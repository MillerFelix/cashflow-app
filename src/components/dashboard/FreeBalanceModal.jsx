import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../hooks/useAuth";
import useGoals from "../../hooks/useGoals";
import { expenseCategories } from "../../components/category/CategoryList";
import ActionButtons from "../common/ActionButtons";
import Button from "../common/Button";

function FreeBalanceModal({ onClose }) {
  const userId = useAuth();
  const { goals, fetchGoals } = useGoals();
  const [balance, setBalance] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      if (!userId) return;

      try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setBalance(userSnapshot.data().balance || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar saldo:", error);
      }
    }

    fetchBalance();
    fetchGoals();
  }, [userId, fetchGoals]);

  useEffect(() => {
    // Pega os nomes das categorias de gasto
    const expenseCategoryNames = expenseCategories.map((c) => c.name);

    // Filtra apenas metas que pertencem às categorias de gasto
    const total = goals
      .filter((goal) => expenseCategoryNames.includes(goal.category))
      .reduce((sum, goal) => sum + goal.goalValue, 0);

    setTotalExpenses(total);
  }, [goals]);

  const freeBalance = balance - totalExpenses;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Informações de Saldo</h3>

        <div className="mb-4">
          <p className="text-gray-800">
            <strong>Saldo:</strong>
            <span className="ml-2 text-green-600 font-medium">
              {balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>

          <p className="text-gray-800">
            <strong>Saldo reservado às metas:</strong>
            <span className="ml-2 text-red-600 font-medium">
              {totalExpenses.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>

          <p className="text-lg font-semibold mt-2">
            <strong>Saldo Livre:</strong>
            <span
              className={`ml-2 ${
                freeBalance >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {freeBalance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>
        </div>

        {goals.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Metas</h4>
            <ul className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
              {goals
                .filter((goal) =>
                  expenseCategories.some((c) => c.name === goal.category)
                )
                .map((goal) => (
                  <li
                    key={goal.id}
                    className="flex justify-between py-1 border-b last:border-0"
                  >
                    <span className="text-gray-700">{goal.category}</span>
                    <span className="text-red-600">
                      {goal.goalValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <Button
          onClick={onClose}
          bgColor="bg-gray-200"
          hoverColor="hover:bg-gray-300"
          className="mt-4 w-full text-gray-700"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}

export default FreeBalanceModal;
