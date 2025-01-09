"use client"
import { useContext, useEffect } from "react";
import PlannerView from "../components/Planner/PlannerView";
import { redirect } from "next/navigation";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";
import { BudgetView } from "@/types/budget";
import BudgetCacheProvider from "../lib/budgetCache";
import { getSavings } from "../lib/savingsApi";

export default function Planner () {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error}: {mappedBudget: BudgetView, error: any} = context?.initialData;
    const { budget, useCachedData} = BudgetCacheProvider.getBudget({
        lastFetched: mappedBudget.lastFetched
    })

    // TODO: this should be a part of the initial data load
    useEffect(() => {
        getSavings(true);
    })
    
    if (error) {
        redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
    }

    return (
        <>
            <PlannerView budget={(useCachedData && !!budget) ? budget : mappedBudget}/>
        </>
    )
}