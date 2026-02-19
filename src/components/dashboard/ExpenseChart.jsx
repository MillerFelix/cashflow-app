import React, { useEffect, useState, useMemo } from "react";
import { ResponsivePie } from "@nivo/pie";

/**
 * Componente ExpenseChart
 * Gráfico de Pizza que agrupa as despesas por categoria.
 */
const ExpenseChart = ({ transactions }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Efeito responsivo: Adapta o gráfico se o usuário deitar o celular
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Só roda o loop de novo se o array 'transactions' mudar!
  const expenseData = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "debit")
      .reduce((acc, transaction) => {
        const existingCategory = acc.find(
          (item) => item.id === transaction.category,
        );
        if (existingCategory) {
          existingCategory.value += transaction.value;
        } else {
          acc.push({ id: transaction.category, value: transaction.value });
        }
        return acc;
      }, []);
  }, [transactions]);

  return (
    <div
      className="h-full w-full flex flex-col justify-center items-center"
      style={{ minHeight: "350px", maxHeight: "100%" }}
    >
      {isMobile && (
        <p className="text-sm text-gray-100 mb-2">
          Toque em um setor do gráfico para visualizar.
        </p>
      )}

      <div className="w-full h-full flex justify-center items-center overflow-hidden">
        <ResponsivePie
          data={expenseData}
          sortByValue={true}
          margin={{ top: 30, right: 20, bottom: 40, left: 20 }}
          innerRadius={0.3}
          padAngle={2}
          cornerRadius={5}
          activeOuterRadiusOffset={8}
          borderWidth={2}
          borderColor={{
            from: "color",
            modifiers: [
              ["darker", 0.6],
              ["opacity", 0.5],
            ],
          }}
          colors={{ scheme: "dark2" }}
          arcLinkLabelsThickness={4}
          arcLabelsTextColor="#fff"
          arcLinkLabelsTextColor="#fff"
          arcLinkLabelsColor={{ from: "color" }}
          enableArcLinkLabels={!isMobile}
          arcLabel={(e) =>
            `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(e.value)}`
          }
          tooltip={({ datum }) => (
            <div
              style={{
                background: datum.color,
                padding: "5px 10px",
                borderRadius: "4px",
                color: "white",
              }}
            >
              <strong>{datum.id}</strong>:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(datum.value)}
            </div>
          )}
          enableRadialLabels={false}
          enableSlicesLabels={true}
          theme={{ labels: { text: { fontSize: 12, fontWeight: 500 } } }}
        />
      </div>
    </div>
  );
};

export default React.memo(ExpenseChart);
