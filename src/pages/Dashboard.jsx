import Card from "../components/Card";

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
    </div>
  );
}

export default Dashboard;
