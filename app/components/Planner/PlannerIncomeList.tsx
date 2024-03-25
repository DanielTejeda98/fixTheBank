type PlannerIncomeList = {
    addIncomeClick: Function
}
export default function PlannerIncomeList({addIncomeClick}: PlannerIncomeList) {
    return (
        <section className="m-3 p-3 border border-slate-500 rounded-md">
            <div className="flex w-full justify-between">
                <h2>Planned Income Streams</h2>
                <button onClick={() => { addIncomeClick() }} className="text-xs">Add Planned Income</button>
            </div>
        </section>
    )
}