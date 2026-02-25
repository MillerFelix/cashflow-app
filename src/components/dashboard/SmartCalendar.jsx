import React, { useState, useMemo } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
  FaArrowUp,
  FaArrowDown,
  FaRegCalendarTimes,
  FaFileInvoiceDollar,
  FaCreditCard,
} from "react-icons/fa";

function SmartCalendar({ transactions, cards = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
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

  // Agrupa transações por data
  const transactionsByDate = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (!map[t.date]) map[t.date] = { income: 0, expense: 0, items: [] };
      if (t.type === "credit") map[t.date].income += t.value;
      else map[t.date].expense += t.value;
      map[t.date].items.push(t);
    });
    return map;
  }, [transactions]);

  // --- LÓGICA DE CALENDÁRIO ---
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, fullDate: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayString = String(i).padStart(2, "0");
      const monthString = String(month + 1).padStart(2, "0");
      const fullDate = `${year}-${monthString}-${dayString}`;

      days.push({
        day: i,
        fullDate,
        data: transactionsByDate[fullDate] || null,
      });
    }
    return days;
  };

  const calendarGrid = generateCalendarGrid();

  // --- HANDLERS ---
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  const handleDateClick = (fullDate) => {
    if (!fullDate) return;
    const [y, m, d] = fullDate.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d, 12, 0, 0));
  };

  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const selectedDayData = transactionsByDate[selectedDateString];
  const isSelectedDateFuture = selectedDate > new Date();

  // Cartões que vencem ou fecham no dia selecionado
  const selectedDayCardsClosing = cards.filter(
    (c) => c.closingDay === selectedDate.getDate(),
  );
  const selectedDayCardsDue = cards.filter(
    (c) => c.dueDay === selectedDate.getDate(),
  );

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
      {/* CALENDÁRIO */}
      <div className="p-6 lg:w-7/12 border-b lg:border-b-0 lg:border-r border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {monthNames[currentDate.getMonth()]}{" "}
              <span className="text-gray-400 font-normal">
                {currentDate.getFullYear()}
              </span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={goToToday}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors mr-2"
            >
              Hoje
            </button>
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {daysInWeek.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarGrid.map((cell, index) => {
            if (!cell.day)
              return <div key={index} className="aspect-square"></div>;

            const isSelected = cell.fullDate === selectedDateString;
            const isToday =
              cell.fullDate === new Date().toISOString().split("T")[0];
            const hasIncome = cell.data?.income > 0;
            const hasExpense = cell.data?.expense > 0;

            // Verifica se tem evento de cartão neste dia
            const hasClosing = cards.some((c) => c.closingDay === cell.day);
            const hasDue = cards.some((c) => c.dueDay === cell.day);

            return (
              <button
                key={cell.fullDate}
                onClick={() => handleDateClick(cell.fullDate)}
                className={`
                  relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 border
                  ${isSelected ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105 z-10" : isToday ? "bg-blue-50 text-blue-700 border-blue-200 font-bold" : "bg-white text-gray-700 border-transparent hover:border-gray-200 hover:bg-gray-50"}
                `}
              >
                <span className="text-sm">{cell.day}</span>

                {/* Dots de Transação */}
                <div className="flex gap-1 mt-1">
                  {hasIncome && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-green-400" : "bg-green-500"}`}
                    ></div>
                  )}
                  {hasExpense && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-red-400" : "bg-red-500"}`}
                    ></div>
                  )}
                </div>

                {/* Marcadores de Cartão (Absolutos) */}
                {(hasClosing || hasDue) && (
                  <div className="absolute top-1 right-1 flex gap-0.5">
                    {hasClosing && (
                      <div
                        className={`w-1.5 h-1.5 rounded-sm ${isSelected ? "bg-gray-400" : "bg-black"}`}
                        title="Fechamento de Fatura"
                      ></div>
                    )}
                    {hasDue && (
                      <div
                        className={`w-1.5 h-1.5 rounded-sm ${isSelected ? "bg-orange-400" : "bg-orange-500"}`}
                        title="Vencimento de Fatura"
                      ></div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda dos Cartões */}
        <div className="flex justify-end gap-3 mt-4 text-[10px] text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-black rounded-sm"></div> Fechamento
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-sm"></div> Vencimento
          </div>
        </div>
      </div>

      {/* DETALHES DO DIA */}
      <div className="p-6 lg:w-5/12 bg-gray-50/50 flex flex-col">
        <div className="mb-6 pb-4 border-b border-gray-200 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              {isSelectedDateFuture ? "Agendado para" : "Extrato de"}
            </p>
            <h3 className="text-2xl font-black text-gray-800 capitalize">
              {selectedDate.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm">
            <FaCalendarDay className="text-gray-400 text-xl" />
          </div>
        </div>

        {/* Notificações de Cartão no Dia */}
        {(selectedDayCardsClosing.length > 0 ||
          selectedDayCardsDue.length > 0) && (
          <div className="mb-4 space-y-2">
            {selectedDayCardsClosing.map((card) => (
              <div
                key={`close-${card.id}`}
                className="bg-gray-800 text-white p-3 rounded-xl flex items-center gap-3 text-xs"
              >
                <FaFileInvoiceDollar className="text-gray-400 text-lg" />
                <div>
                  <p className="font-bold">Fechamento da Fatura</p>
                  <p className="opacity-70">Cartão {card.name}</p>
                </div>
              </div>
            ))}
            {selectedDayCardsDue.map((card) => (
              <div
                key={`due-${card.id}`}
                className="bg-orange-100 text-orange-800 p-3 rounded-xl flex items-center gap-3 text-xs border border-orange-200"
              >
                <FaCreditCard className="text-orange-600 text-lg" />
                <div>
                  <p className="font-bold">Vencimento da Fatura</p>
                  <p className="opacity-80">Cartão {card.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo do Dia */}
        {!selectedDayData &&
        selectedDayCardsClosing.length === 0 &&
        selectedDayCardsDue.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center opacity-50 py-10">
            <FaRegCalendarTimes className="text-4xl mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">
              Nada registrado para este dia.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {selectedDayData && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                      Entradas
                    </p>
                    <p className="text-green-600 font-bold text-lg flex items-center gap-1">
                      <FaArrowUp size={10} />{" "}
                      {formatCurrency(selectedDayData.income)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                      Saídas
                    </p>
                    <p className="text-red-500 font-bold text-lg flex items-center gap-1">
                      <FaArrowDown size={10} />{" "}
                      {formatCurrency(selectedDayData.expense)}
                    </p>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2 max-h-[300px]">
                  {selectedDayData.items.map((t) => (
                    <div
                      key={t.id}
                      className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center text-sm hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div
                          className={`w-1 h-8 rounded-full ${t.type === "credit" ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <div className="truncate">
                          <p className="font-bold text-gray-800 truncate">
                            {t.description}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {t.category}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold whitespace-nowrap ${t.type === "credit" ? "text-green-600" : "text-red-600"}`}
                      >
                        {t.type === "credit" ? "+" : "-"}
                        {formatCurrency(t.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartCalendar;
