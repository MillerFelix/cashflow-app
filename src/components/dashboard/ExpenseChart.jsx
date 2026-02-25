import React, { useEffect, useState, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";

/**
 * Componente ExpenseChart
 * Gráfico de Barras que exibe as despesas por categoria usando Nivo.
 */
const ExpenseChart = ({ transactions }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Efeito responsivo
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Processa os dados para o formato do Nivo Bar
  const expenseData = useMemo(() => {
    const data = transactions
      .filter((transaction) => transaction.type === "debit")
      .reduce((acc, transaction) => {
        const existingCategory = acc.find(
          (item) => item.category === transaction.category,
        );
        if (existingCategory) {
          existingCategory.value += transaction.value;
        } else {
          acc.push({
            category: transaction.category,
            value: transaction.value,
            // Cor dinâmica pode ser adicionada aqui se necessário
          });
        }
        return acc;
      }, []);

    // Ordena por valor (maior para menor) e pega o top 10 para não poluir
    return data.sort((a, b) => b.value - a.value).slice(0, 10);
  }, [transactions]);

  if (expenseData.length === 0) {
    return (
      <div className="h-full w-full flex justify-center items-center text-gray-400 text-sm">
        Sem dados de despesas para exibir.
      </div>
    );
  }

  return (
    <div className="h-full w-full" style={{ minHeight: "350px" }}>
      <ResponsiveBar
        data={expenseData}
        keys={["value"]}
        indexBy="category"
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        borderRadius={4}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: isMobile ? -45 : 0,
          legend: "Categoria",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Valor (R$)",
          legendPosition: "middle",
          legendOffset: -50,
          format: (value) =>
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              notation: "compact",
            }).format(value),
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        role="application"
        ariaLabel="Gráfico de barras de despesas"
        tooltip={({ id, value, indexValue, color }) => (
          <div
            style={{
              padding: 12,
              color: "#fff",
              background: "#333",
              borderRadius: 4,
            }}
          >
            <strong>{indexValue}</strong>:{" "}
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)}
          </div>
        )}
      />
    </div>
  );
};

export default React.memo(ExpenseChart);
