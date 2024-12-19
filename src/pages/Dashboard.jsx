// import { Outlet } from "react-router";

function Dashboard() {
  return (
    <div className="p-4">
      {/* <Outlet /> */}
      <h2 className="text-2xl font-semibold">Resumo Financeiro</h2>
      <div className="mt-4">
        <p className="text-lg">Saldo Atual: R$ 0,00</p>
        {/* Podemos adicionar mais informações de transações depois */}
      </div>
    </div>
  );
}

export default Dashboard;
