import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../common/TextInput";
import MoneyInput from "../common/MoneyInput";
import ActionButtons from "../common/ActionButtons";
import CategoryDropdown from "../category/CategoryDropdown";
import { expenseCategories, incomeCategories } from "../category/CategoryList";
import { CategoryService } from "../../services/categoryService";
import { useAuth } from "../../hooks/useAuth";
import { useCards } from "../../hooks/useCards";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaRegCreditCard,
  FaQrcode,
  FaUniversity,
} from "react-icons/fa";

function TransactionModal({ type, onClose, onSave, initialData }) {
  const user = useAuth();
  const userId = user?.uid;
  const navigate = useNavigate();

  const { cards } = useCards(userId);

  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [userSubcategories, setUserSubcategories] = useState([]);

  const [isFixed, setIsFixed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("debit");
  const [selectedCardId, setSelectedCardId] = useState("");
  const [error, setError] = useState("");

  const categories = type === "credit" ? incomeCategories : expenseCategories;
  const isEditing = !!(initialData && initialData.id);

  const paymentMethods = [
    { id: "money", label: "Dinheiro", icon: <FaMoneyBillWave /> },
    { id: "pix", label: "Pix", icon: <FaQrcode /> },
    { id: "transfer", label: "Transf.", icon: <FaUniversity /> },
    { id: "debit", label: "Débito", icon: <FaRegCreditCard /> },
    { id: "credit", label: "Crédito", icon: <FaCreditCard /> },
  ];

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (userId) {
        const subs = await CategoryService.getSubcategories(userId);
        setUserSubcategories(subs);
      }
    };
    fetchSubcategories();
  }, [userId]);

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || "");
      setValue(
        initialData.value ? Math.round(initialData.value * 100).toString() : "",
      );
      setDate(initialData.date || "");
      setSelectedCategory(initialData.category || "");
      setSelectedSubcategory(initialData.subcategory || "");
      setIsFixed(initialData.isFixed || false);
      setPaymentMethod(initialData.paymentMethod || "debit");
      setSelectedCardId(initialData.cardId || "");
    }
  }, [initialData]);

  const handleAddNewSubcategory = useCallback(
    async (parentCategory, subName) => {
      if (!userId) return;
      try {
        const newSub = await CategoryService.addSubcategory(
          userId,
          parentCategory,
          subName,
        );
        setUserSubcategories((prev) => [...prev, newSub]);
        setSelectedSubcategory(newSub.name);
      } catch (err) {
        console.error("Erro:", err);
      }
    },
    [userId],
  );

  const validateForm = useCallback(() => {
    if (!description || !value || !date || !selectedCategory) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    if (
      (paymentMethod === "credit" || paymentMethod === "debit") &&
      !selectedCardId
    ) {
      setError("Selecione qual cartão foi utilizado.");
      return false;
    }
    setError("");
    return true;
  }, [
    description,
    value,
    date,
    selectedCategory,
    paymentMethod,
    selectedCardId,
  ]);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (validateForm()) {
        const numericValue = parseFloat(value) / 100;
        onSave({
          id: initialData?.id,
          type,
          description,
          value: numericValue,
          date,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          isFixed,
          paymentMethod,
          cardId:
            paymentMethod === "credit" || paymentMethod === "debit"
              ? selectedCardId
              : null,
        });
        onClose();
      }
    },
    [
      validateForm,
      onSave,
      type,
      description,
      value,
      date,
      selectedCategory,
      selectedSubcategory,
      isFixed,
      paymentMethod,
      selectedCardId,
      initialData,
      onClose,
    ],
  );

  const needsCardSelection =
    paymentMethod === "credit" || paymentMethod === "debit";

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar border border-gray-100">
        <div
          className={`h-1.5 w-16 mx-auto rounded-full mb-6 ${type === "credit" ? "bg-green-500" : "bg-red-500"}`}
        ></div>

        <h3 className="text-2xl font-black mb-6 text-gray-900 text-center">
          {isEditing
            ? "Editar Transação"
            : type === "credit"
              ? "Nova Receita"
              : "Nova Despesa"}
        </h3>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <TextInput
            label="Descrição *"
            value={description}
            onChange={setDescription}
            placeholder="Ex: Salário, Mercado..."
          />

          <div className="grid grid-cols-2 gap-4">
            <MoneyInput label="Valor *" value={value} onChange={setValue} />
            <TextInput
              label="Data *"
              value={date}
              onChange={setDate}
              type="date"
            />
          </div>

          <CategoryDropdown
            label="Categoria *"
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            onSelectSubcategory={setSelectedSubcategory}
            userSubcategories={userSubcategories}
            onAddNewSubcategory={handleAddNewSubcategory}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(method.id);
                    if (method.id !== "credit" && method.id !== "debit")
                      setSelectedCardId("");
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200
                    ${
                      paymentMethod === method.id
                        ? type === "credit"
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-gray-900 border-gray-900 text-white"
                        : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className="text-lg mb-1">{method.icon}</div>
                  <span className="text-[9px] font-bold uppercase truncate w-full text-center">
                    {method.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {needsCardSelection && (
            <div className="animate-fadeIn">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-2 block">
                Selecione o Cartão
              </label>

              {cards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedCardId(card.id)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all
                        ${
                          selectedCardId === card.id
                            ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div
                        className={`w-8 h-5 rounded bg-gradient-to-br ${card.color} shadow-sm`}
                      ></div>
                      <span
                        className={`text-sm font-bold truncate ${selectedCardId === card.id ? "text-blue-900" : "text-gray-700"}`}
                      >
                        {card.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center">
                  <p className="text-sm text-orange-800 font-medium mb-2">
                    Você não tem cartões cadastrados.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/cards");
                    }}
                    className="text-xs bg-orange-200 text-orange-900 px-3 py-1.5 rounded-lg font-bold hover:bg-orange-300 transition-colors"
                  >
                    + Cadastrar Cartão Agora
                  </button>
                </div>
              )}
            </div>
          )}

          {!isEditing && (
            <div
              className={`p-4 rounded-xl border transition-all ${isFixed ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-100"}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFixed"
                  checked={isFixed}
                  onChange={(e) => setIsFixed(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <label
                  htmlFor="isFixed"
                  className="font-bold text-gray-700 cursor-pointer select-none text-sm"
                >
                  Repetir mensalmente (Fixo)
                </label>
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded-lg animate-pulse">
              {error}
            </p>
          )}

          <ActionButtons onClose={onClose} />
        </form>
      </div>
    </div>
  );
}

export default React.memo(TransactionModal);
