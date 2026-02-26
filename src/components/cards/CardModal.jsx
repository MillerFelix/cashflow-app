import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import TextInput from "../common/TextInput";
import MoneyInput from "../common/MoneyInput";

const CARD_GRADIENTS = [
  { label: "Nubank", value: "from-purple-700 to-purple-500" },
  { label: "Black", value: "from-gray-900 to-gray-700" },
  { label: "Platinum", value: "from-slate-700 to-slate-500" },
  { label: "Blue", value: "from-blue-800 to-blue-500" },
  { label: "Gold", value: "from-yellow-600 to-yellow-400" },
  { label: "Green", value: "from-emerald-700 to-emerald-500" },
  { label: "Red", value: "from-red-700 to-red-500" },
];

function CardModal({ isOpen, onClose, onSave, editingCard }) {
  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [color, setColor] = useState(CARD_GRADIENTS[0].value);

  useEffect(() => {
    if (isOpen) {
      if (editingCard) {
        setName(editingCard.name);
        setLimit((editingCard.limit * 100).toString());
        setClosingDay(editingCard.closingDay);
        setDueDay(editingCard.dueDay);
        setColor(editingCard.color || CARD_GRADIENTS[0].value);
      } else {
        setName("");
        setLimit("");
        setClosingDay("");
        setDueDay("");
        setColor(CARD_GRADIENTS[0].value);
      }
    }
  }, [isOpen, editingCard]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      limit: parseFloat(limit) / 100,
      closingDay: parseInt(closingDay, 10),
      dueDay: parseInt(dueDay, 10),
      color,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md animate-scaleIn">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {editingCard ? "Editar Cartão" : "Novo Cartão"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextInput
            label="Apelido"
            placeholder="Ex: Nubank"
            value={name}
            onChange={setName}
            required
          />
          <MoneyInput
            label="Limite Total"
            value={limit}
            onChange={setLimit}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Dia Fechamento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={closingDay}
                onChange={(e) => setClosingDay(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 focus:bg-white transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Dia Vencimento
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
              Cor do Cartão
            </label>
            <div className="flex gap-3 flex-wrap">
              {CARD_GRADIENTS.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setColor(g.value)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.value} ${color === g.value ? "ring-2 ring-offset-2 ring-gray-900 scale-110 shadow-md" : "opacity-70 hover:opacity-100"} transition-all`}
                  title={g.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
            >
              Salvar
            </Button>
            <Button
              type="button"
              onClick={onClose}
              bgColor="bg-gray-100"
              hoverColor="hover:bg-gray-200"
              className="flex-1 text-gray-700 shadow-none border border-gray-200"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(CardModal);
