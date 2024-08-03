import { TransactionView } from "@/types/budget"
import { currencyFormat } from "../lib/renderHelper"
import { useAppSelector } from "@/redux/store"

type TransactionCard = {
    transaction: TransactionView
    onClick?: Function
}

export default function TransactionCard({
    transaction,
    onClick
}: TransactionCard) {
    const categories = useAppSelector((state) => state.budgetReducer.value.categories)
    const accounts = useAppSelector((state) => state.budgetReducer.value.accounts)

    let type = "income";
    let account = "";
    if (!transaction.source) {
        type = "expense"
        account = accounts.find(account => account._id === transaction.account)?.name || ""
    }
    const category = categories.find(cat => cat._id === transaction.category)?.name || ""

    return (
        <div className="flex items-center p-2 gap-2 rounded-md border" onClick={() => onClick && onClick()}>
            <div className="rounded-full w-10 h-10"></div>
            <div>
                <p className="text-xs">{ type === "expense" ? category : "Income"}</p>
                <p className="text-sm">{ transaction.description }</p>
                <p className="text-xs">{ account }</p>
            </div>
            <div className="ml-auto">
                <p className={`text-right ${type === "income" ? "text-green-500" : "text-red-500"}`}>{ currencyFormat(transaction.amount) }</p>
                <p className="text-xs text-end text-neutral-400">{new Date(transaction.transactionDate || transaction.date).toLocaleString("en-us", {dateStyle: "full", timeZone: "UTC"})}</p>
            </div>
        </div>
    )
}