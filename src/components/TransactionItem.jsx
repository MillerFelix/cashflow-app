import TransactionCard from "../components/TransactionCard";

function TransactionItem({ transactions, removeTransaction }) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onRemove={removeTransaction}
        />
      ))}
    </div>
  );
}

export default TransactionItem;
