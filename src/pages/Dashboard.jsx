import Card from "../components/Card";
import CategoryList from "../components/CategoryList";

function Dashboard() {
  return (
    <div className="p-8">
      <div className="flex gap-8">
        <Card
          colorStart="from-green-500"
          colorEnd="to-green-800"
          title="Saldo atual"
          button="Ver Detalhes"
        >
          R$ 0,00
        </Card>
      </div>
      <CategoryList />
    </div>
  );
}

export default Dashboard;
