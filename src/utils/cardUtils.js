export const getMonthName = (monthIndex) =>
  new Date(2024, monthIndex, 1).toLocaleDateString("pt-BR", { month: "long" });

export const formatCurrency = (val) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    val,
  );

export const formatDate = (dateStr) =>
  dateStr.split("-").reverse().slice(0, 2).join("/");

export const formatFullDate = (dateStr) =>
  dateStr.split("-").reverse().join("/");

export const processCardInvoices = (cards, transactions) => {
  if (!cards.length) return [];

  return cards.map((card) => {
    const cardTrans = transactions.filter(
      (t) =>
        t.cardId === card.id &&
        t.paymentMethod === "credit" &&
        t.type === "debit",
    );

    const invoices = {};
    let totalUsedLimit = 0;

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
    const openInvoiceKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;

    cardTrans.forEach((t) => {
      const tDate = new Date(t.date + "T12:00:00");
      const day = tDate.getDate();
      let invoiceMonth = tDate.getMonth();
      let invoiceYear = tDate.getFullYear();

      if (day >= card.closingDay) {
        invoiceMonth++;
        if (invoiceMonth > 11) {
          invoiceMonth = 0;
          invoiceYear++;
        }
      }

      const invoiceKey = `${invoiceYear}-${String(invoiceMonth + 1).padStart(2, "0")}`;

      if (t.isFixed && invoiceKey > openInvoiceKey) {
        return; // Pula essa transação neste momento
      }

      if (!invoices[invoiceKey]) {
        invoices[invoiceKey] = {
          id: invoiceKey,
          month: invoiceMonth,
          year: invoiceYear,
          total: 0,
          transactions: [],
          isPaid: false,
          paidDate: null,
        };
      }

      invoices[invoiceKey].transactions.push(t);
      invoices[invoiceKey].total += t.value;

      if (invoiceKey >= openInvoiceKey) {
        totalUsedLimit += t.value;
      }
    });

    Object.values(invoices).forEach((inv) => {
      const expectedDesc = `Pagamento Fatura ${card.name} - ${getMonthName(inv.month)}/${inv.year}`;
      const paymentTrans = transactions.find(
        (t) =>
          (t.paymentMethod === "transfer" ||
            t.paymentMethod === "debit" ||
            t.paymentMethod === "money") &&
          t.category === "Pagamento de Cartão" &&
          t.description === expectedDesc,
      );

      if (paymentTrans) {
        inv.isPaid = true;
        inv.paidDate = paymentTrans.date;
      }
    });

    const history = [];
    const future = [];
    let openInvoice = {
      id: openInvoiceKey,
      month: currentMonth,
      year: currentYear,
      total: 0,
      transactions: [],
      isPaid: false,
    };

    Object.values(invoices).forEach((inv) => {
      if (inv.id === openInvoiceKey) openInvoice = inv;
      else if (inv.id < openInvoiceKey) history.push(inv);
      else future.push(inv);
    });

    history.sort((a, b) => b.id.localeCompare(a.id));
    future.sort((a, b) => a.id.localeCompare(b.id));

    const numericLimit = Number(card.limit);
    const availableLimit = Math.max(0, numericLimit - totalUsedLimit);
    const usagePercentage = Math.min(
      100,
      (totalUsedLimit / numericLimit) * 100,
    );
    const bestBuyDay = card.closingDay + 1 > 31 ? 1 : card.closingDay + 1;

    return {
      ...card,
      openInvoice,
      history,
      future,
      availableLimit,
      usagePercentage,
      bestBuyDay,
      totalUsedLimit,
    };
  });
};
