"use client"
import { redirect } from "next/navigation";
import TransactionsView from "../components/Transactions/TransactionsView";
import { useContext } from "react";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";
import { BudgetView } from "@/types/budget";

export default function Transactions () {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error}: {mappedBudget: BudgetView, error: any} = context?.initialData;
    // Handle the fact that NextJS caches our data from inital load
    let useLocalData = false;
    const cachedBudget = localStorage.getItem("budgetData");
    const parsedCachedBudget = JSON.parse(cachedBudget || "") as BudgetView;

    if (parsedCachedBudget && (mappedBudget.lastFetched < parsedCachedBudget.lastFetched)) {
        useLocalData = true;
    }
    if (error) {
        redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
    }
    
    return (
        <>
            <TransactionsView budget={useLocalData ? parsedCachedBudget : mappedBudget} />
        </>
    )
} 