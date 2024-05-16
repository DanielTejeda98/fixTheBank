"use client"
import { useState } from "react";
import Drawer from "../Drawer";
import FullSizeCard from "../FullSizeCard";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { BudgetView, CategoryView } from "@/types/budget";
import { useSetInitialStore } from "@/redux/features/budget-slice";
import PlannerCategoriesList from "./PlannerCategoriesList";
import { useAppSelector } from "@/redux/store";
import PlannerIncomeList from "./PlannerIncomeList";
import PlannerCategoriesEditor from "./PlannerCategoriesEditor";
import PlannerCategoryView from "./PlannerCategoryView";
import PlannerIncomeEditor from "./PlannerIncomeEditor";
import { Button } from "../ui/button";

export default function PlannerView ({budget}: {budget: BudgetView}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerComponent, setDrawerComponent] = useState("addIncome");
    const [selectedCategory, setSelectedCategory] = useState<CategoryView|undefined>(undefined);

    const budgetMonth = useAppSelector((state) => state.budgetReducer.value.minDate)
    const monthPlannedIncome = useAppSelector((state) => state.budgetReducer.value.plannedIncome.find((pi: any) => pi.month === budgetMonth)?.incomeStreams) || [];
    const categories = useAppSelector((state) => state.budgetReducer.value.categories) as CategoryView[];

    useSetInitialStore({budget});

    const DrawerComponents = {
        selectBudget: <SelectBudget closeDrawer={() => setIsDrawerOpen(false)} />,
        account: <Account closeDrawer={() => setIsDrawerOpen(false)} />,
        categoriesEditor: <PlannerCategoriesEditor categories={categories} />,
        categoryExplorer: <PlannerCategoryView key={selectedCategory?._id} category={selectedCategory} closeDrawer={() => setIsDrawerOpen(false)}/>,
        incomePlanner: <PlannerIncomeEditor closeDrawer={() => setIsDrawerOpen(false)} />
    }
    type ComponentString = "selectBudget" | "account" | "categoryExplorer" | "incomePlanner" | "categoriesEditor"
    const toggleDrawer = (component: ComponentString) => {
        setDrawerComponent(component);
        setIsDrawerOpen(!isDrawerOpen);
    }

    const handleCategoryClick = (category: CategoryView) => {
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
                    <Button className="p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("account")}><FontAwesomeIcon icon={faUser} /></Button>
                    <div className="text-center">
                        <h1>Planner</h1>
                        <p className="text-sm">Planning for Month: <br /> {new Date(budgetMonth).toLocaleDateString("en-us", {month: "long", year: "numeric", timeZone: "UTC"})}</p>
                    </div>
                    <Button className="p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("selectBudget")}><FontAwesomeIcon icon={faGear} /></Button>
                </div>
            </FullSizeCard>
            
            <PlannerIncomeList addIncomeClick={() => toggleDrawer("incomePlanner")} incomeStreams={monthPlannedIncome}/>

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