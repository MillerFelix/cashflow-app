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
    <div
      className="h-full w-full"
      style={{
        minHeight: "250px",
        maxHeight: "400px",
      }}
    >
      <ResponsivePie
        data={incomeData}
        sortByValue={true}
        margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
        innerRadius={0.25}
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
        colors={{ scheme: "category10" }}
        arcLinkLabelsThickness={4}
        arcLabelsTextColor="#fff"
        arcLinkLabelsTextColor="#fff"
        arcLinkLabelsColor={{ from: "color" }}
        arcLabel={(e) =>
          `${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(e.value)}`
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
        theme={{
          labels: {
            text: {
              fontSize: 12,
              fontWeight: 500,
            },
          },
        }}
      />
    </div>
  );
};

export default IncomeChart;
