import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateMonthlyReportPDF = (
  transactions,
  monthYear,
  totalIncomes,
  totalExpenses,
) => {
  const doc = new jsPDF("p", "pt", "a4");

  const [year, month] = monthYear.split("-");
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const formattedMonth = `${monthNames[parseInt(month, 10) - 1]} de ${year}`;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const balance = totalIncomes - totalExpenses;

  // --- CABEÇALHO DO RELATÓRIO ---
  doc.setFontSize(22);
  doc.setTextColor(21, 128, 61); // Verde forte
  doc.text("CashFlow", 40, 50);

  doc.setFontSize(14);
  doc.setTextColor(50, 50, 50);
  doc.text(`Relatório Financeiro - ${formattedMonth}`, 40, 75);

  // --- RESUMO FINANCEIRO (Caixas) ---
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Resumo do Mês:", 40, 105);

  // Entradas
  doc.setTextColor(22, 163, 74);
  doc.text(`Entradas: + ${formatCurrency(totalIncomes)}`, 40, 125);

  // Saídas
  doc.setTextColor(220, 38, 38);
  doc.text(`Saídas: - ${formatCurrency(totalExpenses)}`, 200, 125);

  // Saldo do Mês
  doc.setTextColor(
    balance >= 0 ? 22 : 220,
    balance >= 0 ? 163 : 38,
    balance >= 0 ? 74 : 38,
  );
  doc.setFont(undefined, "bold");
  doc.text(`Balanço do Mês: ${formatCurrency(balance)}`, 360, 125);
  doc.setFont(undefined, "normal");

  // Linha divisória
  doc.setDrawColor(200, 200, 200);
  doc.line(40, 140, 550, 140);

  // --- TABELA DE TRANSAÇÕES ---
  if (transactions.length === 0) {
    doc.setTextColor(150, 150, 150);
    doc.text("Nenhuma transação registada neste mês.", 40, 170);
  } else {
    const tableData = transactions.map((t) => {
      const isCredit = t.type === "credit";
      const dateFormatted = t.date.split("-").reverse().join("/");
      const valueFormatted = `${isCredit ? "+" : "-"} ${formatCurrency(t.value)}`;
      return [
        dateFormatted,
        t.description,
        t.category,
        t.isFixed ? "Sim" : "Não",
        valueFormatted,
      ];
    });

    // 2. Passamos o `doc` como primeiro parâmetro da função autoTable!
    autoTable(doc, {
      startY: 160,
      head: [["Data", "Descrição", "Categoria", "Fixa", "Valor"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [21, 128, 61] },
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: {
        4: { halign: "right", fontStyle: "bold" },
      },
      didParseCell: function (data) {
        if (data.section === "body" && data.column.index === 4) {
          if (data.cell.raw.includes("+")) {
            data.cell.styles.textColor = [22, 163, 74];
          } else {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      },
    });
  }

  // --- RODAPÉ ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Gerado por CashFlow em ${new Date().toLocaleDateString("pt-BR")} - Página ${i} de ${pageCount}`,
      40,
      doc.internal.pageSize.height - 30,
    );
  }

  doc.save(`CashFlow_Relatorio_${year}_${month}.pdf`);
};
