import { currencyFormat } from "@/app/lib/renderHelper";
import { useAppSelector } from "@/redux/store";
import { SavingsTransaction } from "@/types/savings";

export default function SavingsTransactionCard ({transaction}: {transaction: SavingsTransaction}) {
    const buckets = useAppSelector((state) => state.savingsReducer.value.savingsAccounts).flatMap(acc => acc.buckets);
    const bucket = buckets.find(bkt => bkt._id === transaction.bucket);
    const isWithdraw = transaction.transactionType === "withdraw";
    return (
        <div className="border m-1 p-1 text-sm">
          <p className="text-base font-bold">{ transaction!.name }</p>
          <p>{bucket!.name}</p>
          <p className={isWithdraw ? "text-red-500" : ""}>{isWithdraw ? "-" : null}{ currencyFormat(transaction!.amount || 0) }</p>
        </div>
    )
}