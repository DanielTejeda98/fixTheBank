import { useState } from "react";
import { Button } from "../../ui/button";
import ExpenseTransactionCard from "../ExpenseTransactionCard";
import { reconcileExpense } from "@/app/lib/budgetApi";
import { formatDateDisplay } from "@/app/lib/renderHelper";

interface ReconcileExpenseTransactionCardProps {
  id: string;
  name: string;
  amount: number;
  accountName: string;
  categoryName: string;
  date: Date;
  isBorrowFromNextMonth: boolean;
  isGiftTransaction: boolean;
  isSplitTransaction: boolean;
  createdById: string;
  revealDate?: Date | null;
  reconciled: Date | null;
  reconciledBy: string | null;
}

export default function ReconcileExpenseTransactionCard({
  id,
  name,
  amount,
  accountName,
  categoryName,
  date,
  isBorrowFromNextMonth,
  isGiftTransaction,
  isSplitTransaction,
  revealDate,
  createdById,
  reconciled,
  reconciledBy,
}: ReconcileExpenseTransactionCardProps) {
  const [apiPending, setApiPending] = useState(false);
  const handleReconcileClick = async () => {
    try {
      setApiPending(true);
      await reconcileExpense(id, !reconciled);
    } catch {
      console.warn("Error when reconciling");
    } finally {
      setApiPending(false);
    }
  };

  return (
    <div className="flex flex-col border-2 p-2 gap-2 rounded-md">
      <ExpenseTransactionCard
        id={id}
        name={name}
        amount={amount}
        accountName={accountName}
        categoryName={categoryName}
        date={date}
        isBorrowFromNextMonth={isBorrowFromNextMonth}
        isGiftTransaction={isGiftTransaction}
        isSplitTransaction={isSplitTransaction}
        createdById={createdById}
        revealDate={revealDate}
      />
      <div className="flex justify-between">
        <div>
          {reconciled ? (
            <>
              <p className="text-sm">
                Confirmed on:{" "}
                {new Date(reconciled).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm">Confirmed by: {reconciledBy}</p>
            </>
          ) : null}
        </div>
        <Button
          className="w-fit"
          disabled={apiPending}
          onClick={handleReconcileClick}
        >
          {!reconciled ? "Confirm Transaction" : "Clear Reconcilation"}
        </Button>
      </div>
    </div>
  );
}
