"use client"
import { useContext } from "react";
import PlannerView from "../components/Planner/PlannerView";
import { redirect } from "next/navigation";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";
import { BudgetView } from "@/types/budget";

export default function Planner () {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error}: {mappedBudget: BudgetView, error: any} = context?.initialData;
    // Handle the fact that NextJS caches our data from inital load
    let useLocalData = false;
    const cachedBudget = localStorage.getItem("budgetData");
    const parsedCachedBudget = cachedBudget ? JSON.parse(cachedBudget) as BudgetView : null;

    if (parsedCachedBudget && (mappedBudget.lastFetched < parsedCachedBudget.lastFetched)) {
        useLocalData = true;
    }
    
    if (error) {
        redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
    }

    return (
        <>
            <PlannerView budget={(parsedCachedBudget && useLocalData) ? parsedCachedBudget : mappedBudget}/>
        </>
    )
}