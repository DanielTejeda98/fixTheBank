import { currencyFormat } from "@/app/lib/renderHelper"

type PlannerIncomeList = {
    addIncomeClick: Function,
    incomeStreams: any[]
}
export default function PlannerIncomeList({addIncomeClick, incomeStreams}: PlannerIncomeList) {
    const renderIncomeStreams = () => {
        if (!incomeStreams.length) {
            return <p>No income streams added for this month</p>
        }
        return incomeStreams.map(is => {
            return (
                <li className="flex flex-col items-center mb-2 p-2 bg-slate-800 gap-2 rounded-md text-sm" key={is._id}>
                    <div>Source: {is.source}</div>
                    <div>Amount: {currencyFormat(is.amount)}</div>
                </li>
            )
        })
    }

    return (
        <section className="m-3 p-3 border border-slate-500 rounded-md">
            <div className="flex w-full justify-between mb-1">
                <h2>Planned Income Streams</h2>
                <button onClick={() => { addIncomeClick() }} className="text-xs">Add Planned Income</button>
            </div>
            <ul>
                {renderIncomeStreams()}
            </ul>
        </section>
    )
}