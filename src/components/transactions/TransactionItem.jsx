import React from "react";
import TransactionCard from "./TransactionCard";

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

export default React.memo(TransactionItem);
