"use client"

import { useSetInitialStore } from "@/redux/features/budget-slice";
import { useLoadSettings } from "../hooks/useLoadSettings";
import { InitialData } from "@/types/budget";
import BudgetCacheProvider from "../lib/budgetCache";

export default function ReduxInitializer({ children, initialData }: { children: React.ReactNode, initialData: InitialData }) {
    const serverBudget = initialData.mappedBudget;
    const { budget, useCachedData} = BudgetCacheProvider.getBudget({
        lastFetched: serverBudget?.lastFetched
    })
    
    const freshBudget = useCachedData ? budget : serverBudget;

    useSetInitialStore({ budget: freshBudget})
    useLoadSettings();
    return (<>{children}</>)
}