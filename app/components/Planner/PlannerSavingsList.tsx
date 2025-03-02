import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { ReactNode, useEffect, useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSavingsPlans } from "@/app/lib/savingsApi";
import { useAppSelector } from "@/redux/store";
import { PlannedSaving } from "@/types/savings";
import { currencyFormat } from "@/app/lib/renderHelper";
import { useFTBDrawer } from "../ui/ftbDrawer";
import PlannerSavingsEditor from "./PlannerSavingsEditor";

export default function PlannerSavingsList () {
    const [isOpened, setIsOpened] = useState(true)
    const budgetMonth = useAppSelector((state) => state.budgetReducer.value.minDate)
    const monthSp = useAppSelector((state) => state.savingsReducer.value.plannedSavings.find(sp => sp.month === budgetMonth))?.savingsPlans as PlannedSaving[];
    const savingsAccounts = useAppSelector((state) => state.savingsReducer.value.savingsAccounts);
    const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();

    function openSavingsPlanner (sp?: PlannedSaving) {
        setDrawerComponent(<PlannerSavingsEditor savingsTransaction={sp}/>);
        setDrawerOpen(true);
    }
    useEffect(() => {
        if (!budgetMonth) return;
        async function fetchData () {
            await getSavingsPlans(budgetMonth);
        };
        fetchData();
    }, [budgetMonth])

    const renderPlannedSavings = (): ReactNode => {
        if (!monthSp?.length) {
            return <li className="flex flex-col items-center mb-2 p-2 gap-2 border rounded-md text-sm"> No planned savings found for this month</li>;
        }

        return monthSp.map(sp => (
            <li key={sp._id} className="flex flex-col mb-2 p-2 gap-2 border rounded-md text-sm" onClick={() => openSavingsPlanner(sp)}>
                <p>To Account: {savingsAccounts.find(sav => sav._id === sp.account)?.name}</p>
                <p>To Bucket: {savingsAccounts.find(sav => sav._id === sp.account)?.buckets.find(bkt => bkt._id === sp.bucket)?.name}</p>
                <p>Amount: {currencyFormat(sp.amount)}</p>
                <p>Description: {sp.description}</p>
            </li>
        ))
    }
    return (
        <Collapsible asChild open={isOpened} onOpenChange={setIsOpened}>
            <section className="m-3 p-3 border rounded-md">
                <CollapsibleTrigger asChild>
                    <div className="flex justify-between items-center w-full mb-2">
                        <h2>Plan Savings</h2>
                        <FontAwesomeIcon icon={isOpened ? faChevronUp : faChevronDown} />
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="flex flex-wrap w-full">
                        <ul className="w-full">
                            {renderPlannedSavings()}
                        </ul>
                        <Button onClick={() => openSavingsPlanner()} className="ml-auto text-xs">Add new planned savings</Button>
                    </div>
                </CollapsibleContent>
            </section>
        </Collapsible>
    )
}