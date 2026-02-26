import React, { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCards } from "../hooks/useCards";
import { useTransactions } from "../hooks/useTransactions";
import Loader from "../components/common/Loader";
import ConfirmationModal from "../components/common/ConfirmationModal";
import CardModal from "../components/cards/CardModal";
import {
  processCardInvoices,
  formatCurrency,
  formatDate,
  formatFullDate,
  getMonthName,
} from "../utils/cardUtils";
import {
  FaPlus,
  FaCreditCard,
  FaTrash,
  FaEdit,
  FaShoppingBag,
  FaHistory,
  FaFileInvoiceDollar,
  FaClock,
  FaInfoCircle,
  FaCheckCircle,
  FaCalendarDay,
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

  // States de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isPayConfirmOpen, setIsPayConfirmOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [selectedCardDetail, setSelectedCardDetail] = useState(null);

  // Processamento Matemático importado do Utils
  const processedCards = useMemo(
    () => processCardInvoices(cards, transactions),
    [cards, transactions],
  );

  const activeDetail = useMemo(() => {
    if (!selectedCardDetail && processedCards.length > 0)
      return processedCards[0];
    if (!selectedCardDetail) return null;
    return (
      processedCards.find((c) => c.id === selectedCardDetail.id) ||
      processedCards[0]
    );
  }, [processedCards, selectedCardDetail]);

  // Handlers
  const handleOpenModal = (card = null) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleSaveCard = async (cardData) => {
    if (editingCard) await updateCard(editingCard.id, cardData);
    else await addCard(cardData);
    setIsModalOpen(false);
  };

  const handleRequestPayment = (invoice, cardName) => {
    setInvoiceToPay({
      invoiceData: invoice,
      cardName: cardName,
      monthName: getMonthName(invoice.month),
      year: invoice.year,
      formattedValue: formatCurrency(invoice.total),
    });
    setIsPayConfirmOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!invoiceToPay) return;
    await addTransaction({
      description: `Pagamento Fatura ${invoiceToPay.cardName} - ${invoiceToPay.monthName}/${invoiceToPay.year}`,
      value: invoiceToPay.invoiceData.total,
      date: new Date().toISOString().split("T")[0],
      category: "Pagamento de Cartão",
      paymentMethod: "transfer",
      isFixed: false,
      type: "debit",
      cardId: null,
    });
    setIsPayConfirmOpen(false);
    setInvoiceToPay(null);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans text-gray-800 pb-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* CABEÇALHO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Meus Cartões
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestão de limite, faturas e vencimentos.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <FaPlus size={12} /> Novo Cartão
          </button>
        </div>

        {/* LOADER OU ESTADO VAZIO */}
        {loadingCards || loadingTrans ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : processedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 text-center px-4 animate-fadeIn">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <FaCreditCard className="text-5xl text-blue-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Sua carteira está vazia
            </h3>
            <p className="text-gray-500 max-w-sm mb-8">
              Cadastre seu cartão de crédito para controlar o limite.
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
            >
              Adicionar Cartão
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* COLUNA ESQUERDA: LISTA DE CARTÕES */}
            <div className="w-full lg:w-1/3 flex flex-col gap-5">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">
                Selecione um Cartão
              </h3>
              {processedCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCardDetail(card)}
                  className={`cursor-pointer transition-all duration-300 group ${activeDetail?.id === card.id ? "translate-x-2" : "hover:translate-x-1"}`}
                >
                  <div
                    className={`relative h-48 rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br ${card.color} flex flex-col justify-between overflow-hidden ring-4 ${activeDetail?.id === card.id ? "ring-blue-100" : "ring-transparent"}`}
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="flex justify-between items-start z-10">
                      <div>
                        <h3 className="text-xl font-bold tracking-wide">
                          {card.name}
                        </h3>
                        <p className="text-[10px] font-medium opacity-80 uppercase tracking-widest mt-0.5">
                          Vence dia {card.dueDay}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(card);
                          }}
                          className="p-1.5 bg-black/20 hover:bg-black/40 rounded-lg backdrop-blur-md"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Excluir cartão?"))
                              removeCard(card.id);
                          }}
                          className="p-1.5 bg-red-500/50 hover:bg-red-500 rounded-lg backdrop-blur-md"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="z-10">
                      <div className="flex justify-between text-xs font-medium mb-1.5 opacity-90">
                        <span>Limite Utilizado</span>
                        <span className="font-bold">
                          {formatCurrency(card.totalUsedLimit)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-black/30 rounded-full mb-4 overflow-hidden backdrop-blur-sm">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${card.usagePercentage > 90 ? "bg-red-400" : card.usagePercentage > 50 ? "bg-yellow-300" : "bg-green-400"}`}
                          style={{ width: `${card.usagePercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] font-bold opacity-70 uppercase">
                            Disponível
                          </p>
                          <p className="text-lg font-bold">
                            {formatCurrency(card.availableLimit)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold opacity-70 uppercase">
                            Limite Total
                          </p>
                          <p className="text-sm font-bold opacity-90">
                            {formatCurrency(card.limit)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUNA DIREITA: DETALHES DO CARTÃO */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    {activeDetail.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fechamento dia {activeDetail.closingDay} • Vencimento dia{" "}
                    {activeDetail.dueDay}
                  </p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-2">
                  <FaInfoCircle />{" "}
                  <span>
                    Melhor dia de compra:{" "}
                    <strong>Dia {activeDetail.bestBuyDay}</strong>
                  </span>
                </div>
              </div>

              {/* FATURA ABERTA */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                  <FaShoppingBag className="text-blue-600" /> Fatura Aberta
                </h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-end mb-6 border-b border-gray-50 pb-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          Vencimento em{" "}
                          <strong className="capitalize text-gray-800">
                            {getMonthName(activeDetail.openInvoice.month)}/
                            {activeDetail.openInvoice.year}
                          </strong>
                        </p>
                        <p className="text-3xl font-black text-gray-900 mt-1">
                          {formatCurrency(activeDetail.openInvoice.total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">
                          Em aberto
                        </span>
                      </div>
                    </div>
                    {activeDetail.openInvoice.transactions.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-sm italic">
                        Nenhum gasto nesta fatura.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {activeDetail.openInvoice.transactions.map((t) => (
                          <div
                            key={t.id}
                            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <FaCreditCard size={12} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">
                                  {t.description}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-[10px] text-gray-400">
                                    {formatDate(t.date)}
                                  </p>
                                  {t.isFixed && (
                                    <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                      Fixa
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="font-bold text-gray-900 text-sm">
                              {formatCurrency(t.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* FUTURAS */}
              {activeDetail.future.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                    <FaClock className="text-orange-500" /> Previsão (Futuro)
                  </h3>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                    {activeDetail.future.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 flex items-center justify-between hover:bg-orange-50/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-orange-100 text-orange-700 font-bold px-3 py-1.5 rounded-lg text-xs capitalize text-center w-24">
                            {getMonthName(inv.month)}{" "}
                            <span className="block text-[9px] opacity-70">
                              {inv.year}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-700">
                              Fatura Prevista
                            </p>
                            <p className="text-xs text-gray-500">
                              {inv.transactions.length} lançamentos
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(inv.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HISTÓRICO DE FATURAS */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">
                  <FaHistory className="text-gray-400" /> Faturas Fechadas
                </h3>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {activeDetail.history.length === 0 ? (
                    <p className="p-6 text-sm text-gray-400 italic text-center">
                      Nenhuma fatura fechada.
                    </p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {activeDetail.history.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2.5 rounded-xl ${invoice.isPaid ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}
                            >
                              {invoice.isPaid ? (
                                <FaCheckCircle size={16} />
                              ) : (
                                <FaFileInvoiceDollar size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm capitalize">
                                {getMonthName(invoice.month)}{" "}
                                <span className="text-gray-400 text-xs font-normal">
                                  / {invoice.year}
                                </span>
                              </p>
                              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                {invoice.isPaid && invoice.paidDate ? (
                                  <>
                                    <FaCalendarDay size={9} /> Pago dia{" "}
                                    {formatFullDate(invoice.paidDate)}
                                  </>
                                ) : (
                                  `${invoice.transactions.length} compras`
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`font-bold ${invoice.isPaid ? "text-green-600" : "text-gray-900"}`}
                            >
                              {formatCurrency(invoice.total)}
                            </span>
                            {!invoice.isPaid ? (
                              <button
                                onClick={() =>
                                  handleRequestPayment(
                                    invoice,
                                    activeDetail.name,
                                  )
                                }
                                className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-md active:scale-95"
                              >
                                Pagar
                              </button>
                            ) : (
                              <span className="text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                                PAGO
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAIS COMPONENTIZADOS */}
        <CardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCard}
          editingCard={editingCard}
        />

        <ConfirmationModal
          showModal={isPayConfirmOpen}
          title="Confirmar Pagamento de Fatura"
          description={`Deseja confirmar o pagamento da fatura de ${invoiceToPay?.monthName}/${invoiceToPay?.year} no valor de ${invoiceToPay?.formattedValue}?`}
          onConfirm={handleConfirmPayment}
          onCancel={() => setIsPayConfirmOpen(false)}
          confirmText="Pagar Agora"
          cancelText="Cancelar"
          confirmBgColor="bg-green-600"
          confirmHoverColor="hover:bg-green-700"
        />
      </div>
    </div>
  );
}

export default Cards;
