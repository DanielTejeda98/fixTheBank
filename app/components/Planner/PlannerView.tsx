"use client"
import { useState } from "react";
import Drawer from "../Drawer";
import FullSizeCard from "../FullSizeCard";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { BudgetView } from "@/types/budget";
import { useSetInitialStore } from "@/redux/features/budget-slice";
import PlannerCategoriesList from "./PlannerCategoriesList";
import { useAppSelector } from "@/redux/store";
import PlannerIncomeList from "./PlannerIncomeList";
import PlannerCategoriesEditor from "./PlannerCategoriesEditor";

export default function PlannerView ({budget}: {budget: BudgetView}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerComponent, setDrawerComponent] = useState("addIncome");
    const [selectedCategory, setSelectedCategory] = useState("");

    const budgetMonth = useAppSelector((state) => state.budgetReducer.value.minDate)
    const categories = useAppSelector((state) => state.budgetReducer.value.categories);

    useSetInitialStore({budget});

    const DrawerComponents = {
        selectBudget: <SelectBudget closeDrawer={() => setIsDrawerOpen(false)} />,
        account: <Account closeDrawer={() => setIsDrawerOpen(false)} />,
        categoriesEditor: <PlannerCategoriesEditor categories={[]} />,
        categoryExplorer: <div>{selectedCategory}</div>,
        incomePlanner: <div>Income Planner</div>
    }
    type ComponentString = "selectBudget" | "account" | "categoryExplorer" | "incomePlanner" | "categoriesEditor"
    const toggleDrawer = (component: ComponentString) => {
        setDrawerComponent(component);
        setIsDrawerOpen(!isDrawerOpen);
    }

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(category)
        toggleDrawer("categoryExplorer");
    }

    const handleCategoryEditorClick = () => {
        toggleDrawer("categoriesEditor");
    }
    return (
        <main className="w-full">
            <FullSizeCard>
                <div className="flex justify-between">
                    <button className="bg-slate-500 p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("account")}><FontAwesomeIcon icon={faUser} /></button>
                    <div className="text-center">
                        <h1>Planner</h1>
                        <p className="text-sm">Planning for Month: <br /> {new Date(budgetMonth).toLocaleDateString("en-us", {month: "long", year: "numeric"})}</p>
                    </div>
                    <button className="bg-slate-500 p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("selectBudget")}><FontAwesomeIcon icon={faGear} /></button>
                </div>
            </FullSizeCard>
            
            <PlannerIncomeList addIncomeClick={() => toggleDrawer("incomePlanner")}/>

            <PlannerCategoriesList categories={categories}
                                   editCategoriesClick={handleCategoryEditorClick}
                                   cardOnClick={handleCategoryClick}/>

            <Drawer isOpen={isDrawerOpen}
                    closeDrawer={() => setIsDrawerOpen(false)}>
                {DrawerComponents[drawerComponent as keyof typeof DrawerComponents]}
            </Drawer>
        </main>
    )
}