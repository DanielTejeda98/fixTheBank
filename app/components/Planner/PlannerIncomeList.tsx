import { currencyFormat } from "@/app/lib/renderHelper"
import { Button } from "../ui/button"
import { useFTBDrawer } from "../ui/ftbDrawer";
import PlannerIncomeEditor from "./PlannerIncomeEditor";

type PlannerIncomeList = {
    incomeStreams: any[]
}
export default function PlannerIncomeList({incomeStreams}: PlannerIncomeList) {
    const { setOpen, setDrawerComponent } = useFTBDrawer();
    
    function addIncomeClick () {
        setDrawerComponent(<PlannerIncomeEditor />);
        setOpen(true);
    }
    
    const renderIncomeStreams = () => {
        if (!incomeStreams.length) {
            return <p>No income streams added for this month</p>
        }
        return incomeStreams.map(is => {
            return (
                <li className="flex flex-col items-center mb-2 p-2 gap-2 rounded-md text-sm" key={is._id}>
                    <div>Source: {is.source}</div>
                    <div>Amount: {currencyFormat(is.amount)}</div>
                </li>
            )
        })
    }

    return (
        <section className="flex flex-wrap m-3 p-3 border rounded-md">
            <div className="flex w-full justify-between mb-1">
                <h2>Planned Income Streams</h2>
            </div>
            <ul className="w-full">
                {renderIncomeStreams()}
            </ul>
            <Button onClick={() => { addIncomeClick() }} className="text-xs ml-auto">Add Planned Income</Button>
        </section>
    )
}