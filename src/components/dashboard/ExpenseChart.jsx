import { ResponsivePie } from "@nivo/pie";

const ExpenseChart = ({ transactions }) => {
  const expenseData = transactions
    .filter((transaction) => transaction.type === "debit")
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
    <div style={{ height: "400px", width: "100%" }}>
      <ResponsivePie
        data={expenseData}
        sortByValue={true}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
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
        colors={{ scheme: "dark2", kind: "categorical", schemeIndex: 1 }}
        arcLabelsTextColor="#fff"
        arcLinkLabelsTextColor="#ffffff"
        arcLinkLabelsColor="#fff"
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
              fontSize: 15,
              fontWeight: 500,
            },
          },
        }}
      />
    </div>
  );
};

export default ExpenseChart;
