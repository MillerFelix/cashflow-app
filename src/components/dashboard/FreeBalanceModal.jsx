import React, { useMemo } from "react";
import Button from "../common/Button";
import { expenseCategories } from "../../components/category/CategoryList";

/**
 * Componente FreeBalanceModal
 * Exibe um detalhamento do saldo do usuário, subtraindo as metas de despesas
 * para mostrar o "Saldo Livre" (o que realmente pode ser gasto).
 * * Performance: Refatorado para receber os dados via props (balance, totalExpenses, goals).
 * Isso evita requisições duplicadas ao banco de dados e abre o modal instantaneamente.
 */
function FreeBalanceModal({
  onClose,
  balance = 0,
  totalExpenses = 0,
  goals = [],
}) {
  const freeBalance = balance - totalExpenses;

  // Filtra apenas as metas que pertencem às categorias de gasto para exibir na lista
  const expenseGoals = useMemo(() => {
    const expenseCategoryNames = expenseCategories.map((c) => c.name);
    return goals.filter((goal) => expenseCategoryNames.includes(goal.category));
  }, [goals]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Informações de Saldo</h3>

        <div className="mb-4">
          <p className="text-gray-800 flex justify-between">
            <strong>Saldo:</strong>
            <span className="ml-2 text-green-600 font-medium">
              {balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>

          <p className="text-gray-800 flex justify-between mt-1">
            <strong>Reservado às metas:</strong>
            <span className="ml-2 text-red-600 font-medium">
              {totalExpenses.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </p>

          <div className="border-t my-2 pt-2">
            <p className="text-lg font-semibold flex justify-between">
              <strong>Saldo Livre:</strong>
              <span
                className={freeBalance >= 0 ? "text-green-700" : "text-red-700"}
              >
                {freeBalance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Lista de Metas Reservadas */}
        {expenseGoals.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-800 mb-2">
              Valores reservados
            </h4>
            <ul className="max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
              {expenseGoals.map((goal) => (
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

export default React.memo(FreeBalanceModal);
