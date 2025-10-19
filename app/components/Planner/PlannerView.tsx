"use client"
import FullSizeCard from "../Core/FullSizeCard";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Core/Account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { BudgetView, CategoryView } from "@/types/budget";
import PlannerCategoriesList from "./PlannerCategoriesList";
import { useAppSelector } from "@/redux/store";
import PlannerIncomeList from "./PlannerIncomeList";
import { Button } from "../ui/button";
import PlannerSavingsList from "./PlannerSavingsList";
import { useFTBDrawer } from "../ui/ftbDrawer";
import TopOptions from "../Core/TopOptions";
import { formatDateDisplay } from "@/app/lib/renderHelper";

export default function PlannerView () {
    const { setDrawerComponent, setOpen: setDrawerOpen} = useFTBDrawer();

    const budgetMonth = useAppSelector((state) => state.budgetReducer.value.minDate)
    const monthPlannedIncome = useAppSelector((state) => state.budgetReducer.value.plannedIncome.find((pi: any) => pi.month === budgetMonth)?.incomeStreams) || [];
    const categories = useAppSelector((state) => state.budgetReducer.value.categories) as CategoryView[];

    const DrawerComponents = {
        selectBudget: <SelectBudget />,
        account: <Account />
    }
    const toggleDrawer = (component: keyof typeof DrawerComponents) => {
        setDrawerComponent(DrawerComponents[component]);
        setDrawerOpen(true);
    }
    
    return (
        <main className="w-full">
            <FullSizeCard>
                <div className="flex justify-between">
                    <TopOptions>
                        <div className="text-center">
                            <h1>Planner</h1>
                            <p className="text-sm">Planning for Month: <br /> {formatDateDisplay(budgetMonth)}</p>
                        </div>
                    </TopOptions>
                </div>
            </FullSizeCard>
            
            <PlannerIncomeList incomeStreams={monthPlannedIncome}/>

            <PlannerCategoriesList categories={categories} />

            <PlannerSavingsList />
        </main>
    )
}