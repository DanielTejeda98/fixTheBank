import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import ReconcileIncomeTransactionCard from "./ReconcileIncomeTransactionCard";
import { IncomeTransaction } from "@/types/budget";
import { useState } from "react";

export default function ReconcileIncomeCollapse({
  incomeTransactions,
}: {
  incomeTransactions: IncomeTransaction[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible asChild open={open} onOpenChange={setOpen}>
      <section className="m-3 p-3 border rounded-md">
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center w-full mb-2 gap-3">
            <div className="flex justify-between w-full">
              <h2>Income transactions</h2>
              <span>
                (
                {
                  incomeTransactions.filter((it) => Boolean(it.reconciled))
                    .length
                }
                /{incomeTransactions.length})
              </span>
            </div>
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2">
            {incomeTransactions.map((income, index) => (
              <ReconcileIncomeTransactionCard
                key={`income_${index}`}
                id={income._id}
                name={income.source}
                date={income.date}
                amount={income.amount}
                reconciled={income.reconciled}
                reconciledBy={income.reconciledBy?.username}
              />
            ))}
          </div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}
