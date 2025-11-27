import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import ReconcileExpenseTransactionCard from "./ReconcileExpenseTransactionCard";
import { ExpenseTransaction } from "@/types/budget";
import { useAppSelector } from "@/redux/store";
import { selectCategories } from "@/redux/features/budget-slice";
import { useState } from "react";

export default function ReconcileAccountCollapse({
  name,
  transactions,
}: {
  name: string;
  transactions?: ExpenseTransaction[];
}) {
  const categories = useAppSelector(selectCategories);
  const [open, setOpen] = useState(false);

  if (!transactions) return null;

  return (
    <Collapsible asChild open={open} onOpenChange={setOpen}>
      <section className="m-3 p-3 border rounded-md">
        <CollapsibleTrigger asChild>
          <div className="flex justify-between items-center w-full mb-2 gap-3">
            <div className="flex justify-between w-full">
              <h2>{name}</h2>
              <span>
                (
                {transactions.filter((accT) => Boolean(accT.reconciled))
                  .length ?? 0}
                /{transactions.length ?? 0})
              </span>
            </div>
            <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-2">
            {transactions.map((expense) => (
              <ReconcileExpenseTransactionCard
                key={`expense_${expense._id}`}
                id={expense._id}
                name={expense.description}
                amount={expense.amount}
                accountName={name}
                categoryName={
                  categories.find(
                    (category) => category._id === expense.category
                  )?.name || ""
                }
                date={expense.transactionDate || expense.date}
                isBorrowFromNextMonth={expense.borrowFromNextMonth}
                isGiftTransaction={expense.giftTransaction}
                isSplitTransaction={!!expense.splitPaymentMasterId}
                createdById={expense.createdBy._id}
                revealDate={expense.revealGiftDate}
                reconciled={expense.reconciled}
                reconciledBy={expense.reconciledBy?.username}
              />
            ))}
          </div>
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}
