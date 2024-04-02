import { currencyFormat } from "../lib/renderHelper"

type TransactionCard = {
    id: string,
    type: string,
    category: string
    account: string, 
    amount: number,
    description: string,
    date: Date
}

export default function TransactionCard({
    id,
    type,
    category,
    account,
    amount,
    description,
    date
}: TransactionCard) {

    return (
        <div className="flex items-center p-2 bg-slate-800 gap-2 rounded-md">
            <div className="rounded-full w-10 h-10 bg-slate-300"></div>
            <div>
                <p className="text-xs">{ type === "expense" ? category : "Income"}</p>
                <p className="text-sm">{ description }</p>
                <p className="text-xs">{ account }</p>
            </div>
            <div className="ml-auto">
                <p className={`text-right ${type === "income" ? "text-green-500" : "text-red-500"}`}>{ currencyFormat(amount) }</p>
                <p className="text-xs text-end text-neutral-400">{new Date(date).toLocaleString("en-us", {dateStyle: "full", timeZone: "UTC"})}</p>
            </div>
        </div>
    )
}