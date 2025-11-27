import { useState } from "react";
import { Button } from "../../ui/button";
import IncomeTransactionCard from "../IcomeTransactionCard";
import { reconcileIncome } from "@/app/lib/budgetApi";
import { formatDateDisplay } from "@/app/lib/renderHelper";

export default function ReconcileIncomeTransactionCard({
  id,
  name,
  amount,
  date,
  reconciled,
  reconciledBy,
}: {
  id: string;
  name: string;
  amount: number;
  date: Date;
  reconciled: Date | null;
  reconciledBy: string | null;
}) {
  const [apiPending, setApiPending] = useState(false);
  const handleReconcileClick = async () => {
    try {
      setApiPending(true);
      await reconcileIncome(id, !reconciled);
    } catch {
      console.warn("Error when reconciling");
    } finally {
      setApiPending(false);
    }
  };
  return (
    <div className="flex flex-col border-2 p-2 gap-2 rounded-md">
      <IncomeTransactionCard id={id} name={name} amount={amount} date={date} />
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
