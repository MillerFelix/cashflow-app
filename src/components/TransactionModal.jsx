import { useState } from "react";
import Button from "./Button";

/* eslint-disable react/prop-types */
function TransactionModal({ type, onClose, onSave }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");

  function handleSave() {
    onSave(type, description, parseFloat(amount), date, category);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold mb-4">
          Adicionar {type === "credit" ? "Crédito" : "Débito"}
        </h3>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Valor
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Categoria
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </form>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={handleSave}
            bgColor="bg-gray-200"
            hoverColor="hover:bg-gray-300"
            className="text-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            bgColor="bg-green-600"
            hoverColor="hover:bg-green-700"
            className="text-gray-200"
          >
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
/* eslint-enable react/prop-types */

export default TransactionModal;
