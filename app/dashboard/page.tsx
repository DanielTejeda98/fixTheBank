"use client";
import { useContext } from "react";
import DashboardView from "../components/Dashboard/DashboardView";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";
import { BudgetView } from "@/types/budget";
import BudgetCacheProvider from "../lib/budgetCache";

export default function Dashboard() {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error}: {mappedBudget: BudgetView, error: any} = context?.initialData;
    const { budget, useCachedData} = BudgetCacheProvider.getBudget({
        lastFetched: mappedBudget.lastFetched
    })
    
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
                <DashboardView budget={(useCachedData && !!budget) ? budget : mappedBudget} />
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