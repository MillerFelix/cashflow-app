import React from "react";
import { ResponsivePie } from "@nivo/pie";

const IncomeChart = ({ transactions }) => {
  const incomeData = transactions
    .filter((transaction) => transaction.type === "credit")
    .reduce((acc, transaction) => {
      const existingCategory = acc.find(
        (item) => item.id === transaction.category
      );
      if (existingCategory) {
        existingCategory.value += transaction.value;
      } else {
        acc.push({ id: transaction.category, value: transaction.value });
      }
      return acc;
    }, []);

  return (
    <div style={{ height: "300px" }}>
      <ResponsivePie
        data={incomeData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor="inherit:darker(0.2)"
        colors={{ scheme: "nivo" }}
        sliceLabel={(e) => `${e.id}: R$ ${e.value.toFixed(2)}`}
        enableRadialLabels={false}
        enableSlicesLabels={true}
      />
    </div>
  );
};

export default IncomeChart;
