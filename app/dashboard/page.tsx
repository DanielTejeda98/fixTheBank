"use client"
import { useContext } from "react";
import DashboardView from "../components/Dashboard/DashboardView";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";
import { BudgetView } from "@/types/budget";

export default function Dashboard() {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error}: {mappedBudget: BudgetView, error: any} = context?.initialData;
    // Handle the fact that NextJS caches our data from inital load
    let useLocalData = false;
    const cachedBudget = localStorage.getItem("budgetData");
    const parsedCachedBudget = cachedBudget ? JSON.parse(cachedBudget) as BudgetView : null;

    if (parsedCachedBudget && (mappedBudget.lastFetched < parsedCachedBudget.lastFetched)) {
        useLocalData = true;
    }
    
    try {
        if (error) {
            if (error === 'No budget found') {
                return (
                    <>
                        <JoinOrCreateBudget />
                    </>
                )
            }
            throw error;
        }

        return (
            <>
                <DashboardView budget={(useLocalData && !!parsedCachedBudget) ? parsedCachedBudget : mappedBudget} />
            </>
        )

    } catch (error) {
        console.log(error);
        return (
            <>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <div>Data didn't load :c</div>
            </>
            )
    }
}