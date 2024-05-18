"use client"
import { redirect } from "next/navigation";
import TransactionsView from "../components/Transactions/TransactionsView";
import { useContext } from "react";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";

export default function Transactions () {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error} = context?.initialData;
    if (error) {
        redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
    }
    
    return (
        <>
            <TransactionsView budget={mappedBudget} />
        </>
    )
} 