import { TransactionView } from "@/types/budget"
import { currencyFormat } from "../lib/renderHelper"
import { useAppSelector } from "@/redux/store"
import { useFTBDrawer } from "./ui/ftbDrawer"
import TransactionViewer from "./Transactions/TransactionViewer"

type TransactionCard = {
    transaction: TransactionView
}

export default function TransactionCard({
    transaction
}: TransactionCard) {
    const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();
    const categories = useAppSelector((state) => state.budgetReducer.value.categories)
    const accounts = useAppSelector((state) => state.budgetReducer.value.accounts)

    let type = "income";
    let account = "";
    if (!transaction.source) {
        type = "expense"
        account = accounts.find(account => account._id === transaction.account)?.name || ""
    }
    const category = categories.find(cat => cat._id === transaction.category)?.name || ""

    function openTransactionDrawer () {
        setDrawerComponent(<TransactionViewer transaction={transaction} />);
        setDrawerOpen(true);
    }

    return (
        <div className="flex items-center p-2 gap-2 rounded-md border max-w-[calc(100vw-3rem)]" onClick={() => openTransactionDrawer()} data-qa="transaction-card">
            <div className="flex rounded-full min-w-10 h-10 justify-center items-center outline outline-1 outline-slate-700 dark:outline-hidden dark:bg-slate-700 dark:text-white">
                { type === "expense" ? category.substring(0,2).toUpperCase() : "I" }
            </div>
            <div>
                <p className="text-xs">{ type === "expense" ? category : "Income"}</p>
                <p className="text-sm break-words max-w-[calc(100vw-3rem-12rem)] line-clamp-2">{ transaction.description }</p>
                <p className="text-xs">{ account }</p>
            </div>
            <div className="ml-auto">
                <p className={`text-right ${type === "income" ? "text-green-500" : "text-red-500"}`}>{ currencyFormat(transaction.amount) }</p>
                <p className="text-xs text-end text-neutral-400">{new Date(transaction.transactionDate || transaction.date).toLocaleString("en-us", {dateStyle: "full", timeZone: "UTC"})}</p>
            </div>
        </div>
    )
}