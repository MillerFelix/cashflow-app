import React, { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCards } from "../hooks/useCards";
import { useTransactions } from "../hooks/useTransactions";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import TextInput from "../components/common/TextInput";
import MoneyInput from "../components/common/MoneyInput";
import TransactionModal from "../components/transactions/TransactionModal";
import {
  FaPlus,
  FaCreditCard,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
  FaShoppingBag,
  FaArrowRight,
  FaCheckCircle,
  FaHistory,
  FaFileInvoiceDollar,
  FaClock,
  FaSyncAlt,
} from "react-icons/fa";

function Cards() {
  const user = useAuth();
  const userId = user?.uid;
  const {
    cards,
    loading: loadingCards,
    addCard,
    updateCard,
    removeCard,
  } = useCards(userId);
  const {
    transactions,
    loading: loadingTrans,
    addTransaction,
  } = useTransactions(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);

  const [selectedCardDetail, setSelectedCardDetail] = useState(null);

  const [name, setName] = useState("");
  const [limit, setLimit] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [color, setColor] = useState("from-purple-600 to-blue-600");

  const cardGradients = [
    { label: "Roxo Nubank", value: "from-purple-700 to-purple-500" },
    { label: "Preto Black", value: "from-gray-900 to-gray-700" },
    { label: "Azul Platinum", value: "from-blue-800 to-blue-500" },
    { label: "Ouro Gold", value: "from-yellow-600 to-yellow-400" },
    { label: "Verde Cash", value: "from-emerald-700 to-emerald-500" },
    { label: "Vermelho", value: "from-red-700 to-red-500" },
  ];

  // --- LÓGICA DE CÁLCULO DE FATURAS ---
  const processedCards = useMemo(() => {
    if (!cards.length) return [];

    return cards.map((card) => {
      // Filtra apenas compras neste cartão
      const cardTrans = transactions.filter(
        (t) =>
          t.cardId === card.id &&
          t.paymentMethod === "credit" &&
          t.type === "debit",
      );

      const invoices = {};

      // 1. Distribui transações nas faturas corretas
      cardTrans.forEach((t) => {
        const tDate = new Date(t.date + "T12:00:00");
        const day = tDate.getDate();
        let invoiceMonth = tDate.getMonth();
        let invoiceYear = tDate.getFullYear();

        // Regra de Ouro: Se comprou no dia do fechamento ou depois, cai no mês seguinte
        if (day >= card.closingDay) {
          invoiceMonth++;
          if (invoiceMonth > 11) {
            invoiceMonth = 0;
            invoiceYear++;
          }
        }

        const invoiceKey = `${invoiceYear}-${String(invoiceMonth + 1).padStart(2, "0")}`;

        if (!invoices[invoiceKey]) {
          invoices[invoiceKey] = {
            id: invoiceKey,
            month: invoiceMonth,
            year: invoiceYear,
            total: 0,
            status: "closed",
            transactions: [],
          };
        }

        invoices[invoiceKey].transactions.push(t);
        invoices[invoiceKey].total += t.value;
      });

      // 2. Determina qual é a fatura ABERTA hoje
      const today = new Date();
      let currentMonth = today.getMonth();
      let currentYear = today.getFullYear();

      if (today.getDate() >= card.closingDay) {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
      }

      const openKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

      // 3. Separa em: Histórico (Passado), Aberta (Atual), Futuro (Lançamentos/Recorrências)
      const history = [];
      const future = [];
      let openInvoice = {
        id: openKey,
        month: currentMonth,
        year: currentYear,
        total: 0,
        transactions: [],
      };

      // Itera sobre as faturas criadas e organiza
      // Se não existir transação na fatura aberta, ela fica zerada (criada acima)
      Object.values(invoices).forEach((inv) => {
        if (inv.id === openKey) {
          openInvoice = inv;
        } else if (inv.id < openKey) {
          history.push(inv);
        } else {
          future.push(inv);
        }
      });

      // Ordena: Histórico (Recente -> Antigo) | Futuro (Próximo -> Distante)
      history.sort((a, b) => b.id.localeCompare(a.id));
      future.sort((a, b) => a.id.localeCompare(b.id));

      // Calcula limite disponível (Limite - (Aberta + Futuras))
      // Nota: Isso é uma aproximação. Idealmente seria Limite - Saldo Devedor Total.
      const totalCommitted =
        openInvoice.total + future.reduce((acc, f) => acc + f.total, 0);

      return {
        ...card,
        openInvoice,
        history,
        future,
        availableLimit: Math.max(0, card.limit - totalCommitted),
      };
    });
  }, [cards, transactions]);

  const activeDetail = useMemo(() => {
    if (!selectedCardDetail) return null;
    return processedCards.find((c) => c.id === selectedCardDetail.id) || null;
  }, [processedCards, selectedCardDetail]);

  // --- ACTIONS ---
  const handleOpenModal = (card = null) => {
    if (card) {
      setEditingCard(card);
      setName(card.name);
      setLimit((card.limit * 100).toString());
      setClosingDay(card.closingDay);
      setDueDay(card.dueDay);
      setColor(card.color || cardGradients[0].value);
    } else {
      setEditingCard(null);
      setName("");
      setLimit("");
      setClosingDay("");
      setDueDay("");
      setColor(cardGradients[0].value);
    }
    setIsModalOpen(true);
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    const cardData = {
      name,
      limit: parseFloat(limit) / 100,
      closingDay: parseInt(closingDay),
      dueDay: parseInt(dueDay),
      color,
    };
    if (editingCard) await updateCard(editingCard.id, cardData);
    else await addCard(cardData);
    setIsModalOpen(false);
  };

  const handleOpenPayModal = (invoice, cardName) => {
    setInvoiceToPay({
      description: `Pagamento Fatura ${cardName} - ${getMonthName(invoice.month)}`,
      value: invoice.total,
      date: new Date().toISOString().split("T")[0],
    });
    setIsPayModalOpen(true);
  };

  const handlePayInvoice = async (data) => {
    await addTransaction({
      ...data,
      isFixed: false,
      cardId: null,
    });
    setIsPayModalOpen(false);
    alert("Pagamento registrado! Valor debitado do saldo.");
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  const formatDate = (dateStr) =>
    dateStr.split("-").reverse().slice(0, 2).join("/");
  const getMonthName = (monthIndex) =>
    new Date(2024, monthIndex, 1).toLocaleDateString("pt-BR", {
      month: "long",
    });

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans text-gray-800 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* TOPO */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Carteira</h1>
            <p className="text-gray-500 mt-1">
              Gerencie seus cartões e previsões.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <FaPlus size={12} /> Novo Cartão
          </button>
        </div>

        {loadingCards || loadingTrans ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : processedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-4">
            <div className="bg-gray-50 p-6 rounded-full mb-4">
              <FaCreditCard className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Sua carteira está vazia
            </h3>
            <button
              onClick={() => handleOpenModal()}
              className="text-blue-600 font-bold hover:underline"
            >
              Cadastrar Cartão
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* COLUNA ESQUERDA: LISTA DE CARTÕES */}
            <div className="w-full lg:w-5/12 grid grid-cols-1 gap-5">
              {processedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardDetail(card)}
                  className={`cursor-pointer transition-all duration-300 ${activeDetail?.id === card.id ? "scale-[1.02] ring-4 ring-gray-200" : "hover:-translate-y-1"}`}
                >
                  <div
                    className={`relative h-52 rounded-3xl p-6 text-white shadow-xl bg-gradient-to-br ${card.color} flex flex-col justify-between overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

                    <div className="flex justify-between items-start z-10">
                      <div>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
                          Cartão de Crédito
                        </p>
                        <h3 className="text-2xl font-bold mt-1 tracking-wide">
                          {card.name}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <FaCreditCard className="text-2xl opacity-50" />
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenModal(card);
                            }}
                            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-md transition-colors"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm("Excluir cartão?"))
                                removeCard(card.id);
                            }}
                            className="p-1.5 bg-red-500/50 hover:bg-red-500 rounded-lg backdrop-blur-md transition-colors"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="z-10">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-xs font-bold opacity-70 mb-0.5">
                            Disponível
                          </p>
                          <p className="text-lg font-bold">
                            {formatCurrency(card.availableLimit)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold opacity-70 mb-0.5">
                            Fatura Aberta
                          </p>
                          <p className="text-2xl font-black">
                            {formatCurrency(card.openInvoice.total)}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs font-medium bg-black/20 p-2 rounded-xl backdrop-blur-sm">
                        <span>
                          Fecha: <strong>Dia {card.closingDay}</strong>
                        </span>
                        <span>
                          Vence: <strong>Dia {card.dueDay}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUNA DIREITA: DETALHES */}
            <div className="w-full lg:w-7/12">
              {activeDetail ? (
                <div className="flex flex-col gap-6 animate-fadeIn">
                  {/* CARD 1: FATURA ABERTA (Atual) */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <FaShoppingBag className="text-blue-600" /> Fatura
                          Aberta
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 capitalize font-medium">
                          Vencimento em{" "}
                          {getMonthName(activeDetail.openInvoice.month)}
                        </p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                        Atual
                      </span>
                    </div>

                    {activeDetail.openInvoice.transactions.length === 0 ? (
                      <p className="text-gray-400 text-sm italic text-center py-6">
                        Nenhuma compra na fatura atual.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {activeDetail.openInvoice.transactions.map((t) => (
                          <div
                            key={t.id}
                            className="flex justify-between items-center text-sm group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-gray-50 p-2 rounded-lg text-gray-400 group-hover:text-blue-500 transition-colors">
                                <FaCreditCard size={12} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">
                                  {t.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-[10px] text-gray-400">
                                    {formatDate(t.date)} • {t.category}
                                  </p>
                                  {t.isFixed && (
                                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 rounded font-bold">
                                      <FaSyncAlt className="inline mr-0.5" />{" "}
                                      Fixa
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(t.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">
                        Total Parcial
                      </span>
                      <span className="text-xl font-black text-gray-900">
                        {formatCurrency(activeDetail.openInvoice.total)}
                      </span>
                    </div>
                  </div>

                  {/* CARD 2: FATURAS FUTURAS (Recorrências e Agendamentos) */}
                  {activeDetail.future.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FaClock /> Lançamentos Futuros
                      </h3>
                      <div className="flex flex-col gap-3">
                        {activeDetail.future.map((inv) => (
                          <div
                            key={inv.id}
                            className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-bold text-gray-800 capitalize">
                                {getMonthName(inv.month)} {inv.year}
                              </p>
                              <p className="text-xs text-gray-500">
                                {inv.transactions.length} lançamentos previstos
                              </p>
                            </div>
                            <span className="font-bold text-gray-900">
                              {formatCurrency(inv.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CARD 3: HISTÓRICO (Faturas Fechadas) */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaHistory className="text-gray-400" /> Faturas Fechadas
                    </h3>

                    {activeDetail.history.length === 0 ? (
                      <p className="text-gray-400 text-sm italic text-center py-4">
                        Nenhuma fatura fechada ainda.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {activeDetail.history.map((invoice) => (
                          <div
                            key={invoice.id}
                            className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-3">
                                <div className="bg-green-100 text-green-600 p-2.5 rounded-xl">
                                  <FaFileInvoiceDollar />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 capitalize">
                                    {getMonthName(invoice.month)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {invoice.transactions.length} compras
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-black text-gray-900">
                                  {formatCurrency(invoice.total)}
                                </p>
                                <button
                                  onClick={() =>
                                    handleOpenPayModal(
                                      invoice,
                                      activeDetail.name,
                                    )
                                  }
                                  className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg mt-1 transition-colors shadow-sm flex items-center gap-1 ml-auto"
                                >
                                  <FaCheckCircle /> Pagar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                  <FaArrowRight className="text-4xl mb-4 opacity-20 text-gray-900" />
                  <p className="font-medium text-lg text-gray-600">
                    Selecione um cartão
                  </p>
                  <p className="text-sm">
                    Toque num cartão ao lado para ver a fatura atual e futuras.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL DE CADASTRO */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingCard ? "Editar Cartão" : "Novo Cartão"}
              </h3>
              <form onSubmit={handleSaveCard} className="flex flex-col gap-4">
                <TextInput
                  label="Apelido"
                  placeholder="Ex: Nubank"
                  value={name}
                  onChange={setName}
                />
                <MoneyInput label="Limite" value={limit} onChange={setLimit} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                      Fecha dia
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={closingDay}
                      onChange={(e) => setClosingDay(e.target.value)}
                      className="w-full p-3 border rounded-xl font-bold bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                      Vence dia
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={dueDay}
                      onChange={(e) => setDueDay(e.target.value)}
                      className="w-full p-3 border rounded-xl font-bold bg-gray-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-2 block">
                    Cor
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {cardGradients.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setColor(g.value)}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${g.value} ${color === g.value ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "opacity-70"} transition-all shadow-sm`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gray-900 text-white"
                  >
                    Salvar
                  </Button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-white border border-gray-200 text-gray-700 font-bold rounded-xl py-3 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DE PAGAMENTO */}
        {isPayModalOpen && (
          <TransactionModal
            type="debit"
            initialData={{
              description: invoiceToPay.description,
              value: invoiceToPay.value,
              date: invoiceToPay.date,
              category: "Pagamento de Cartão",
              paymentMethod: "money",
            }}
            onClose={() => setIsPayModalOpen(false)}
            onSave={handlePayInvoice}
          />
        )}
      </div>
    </div>
  );
}

export default Cards;
