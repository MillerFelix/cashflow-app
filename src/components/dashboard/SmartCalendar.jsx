import React, { useState, useMemo, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
  FaArrowUp,
  FaArrowDown,
  FaRegCalendarTimes,
} from "react-icons/fa";

function SmartCalendar({ transactions }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Garante que ao trocar de mês, se o dia selecionado for do mês visualizado, mantém.
  // Se não, foca no dia 1 ou mantém a seleção visual apenas.

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

  // --- LÓGICA DE DADOS ---

  // Agrupa transações por data (YYYY-MM-DD) para busca rápida
  const transactionsByDate = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      // t.date vem como YYYY-MM-DD string
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

    // Dias vazios (padding) do mês anterior
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, fullDate: null });
    }

    // Dias do mês atual
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
    // Corrige timezone setando meio-dia
    const [y, m, d] = fullDate.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d, 12, 0, 0));
  };

  // --- RENDERIZAÇÃO DO DETALHE DO DIA ---
  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const selectedDayData = transactionsByDate[selectedDateString];

  const isSelectedDateFuture = selectedDate > new Date();

  const formatCurrency = (val) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
      {/* LADO ESQUERDO: O CALENDÁRIO */}
      <div className="p-6 lg:w-7/12 border-b lg:border-b-0 lg:border-r border-gray-100">
        {/* Cabeçalho do Calendário */}
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

        {/* Grade Semanal */}
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

        {/* Grade de Dias */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarGrid.map((cell, index) => {
            if (!cell.day)
              return <div key={index} className="aspect-square"></div>; // Espaço vazio

            const isSelected = cell.fullDate === selectedDateString;
            const isToday =
              cell.fullDate === new Date().toISOString().split("T")[0];
            const hasIncome = cell.data?.income > 0;
            const hasExpense = cell.data?.expense > 0;

            return (
              <button
                key={cell.fullDate}
                onClick={() => handleDateClick(cell.fullDate)}
                className={`
                  relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200 border
                  ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-105 z-10"
                      : isToday
                        ? "bg-blue-50 text-blue-700 border-blue-200 font-bold"
                        : "bg-white text-gray-700 border-transparent hover:border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <span className="text-sm">{cell.day}</span>

                {/* Indicadores (Dots) */}
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
              </button>
            );
          })}
        </div>
      </div>

      {/* LADO DIREITO: DETALHES DO DIA */}
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

        {/* Resumo do Dia */}
        {!selectedDayData ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center opacity-50 py-10">
            <FaRegCalendarTimes className="text-4xl mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-500">
              Nada registrado para este dia.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Balanço do Dia */}
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

            {/* Lista de Itens */}
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
                      <p className="text-[10px] text-gray-400">{t.category}</p>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartCalendar;
