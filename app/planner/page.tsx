"use client"
import { useContext } from "react";
import PlannerView from "../components/Planner/PlannerView";
import { redirect } from "next/navigation";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";

export default function Planner () {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error} = context?.initialData;
    
    if (error) {
        redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
    }

    return (
        <>
            <PlannerView budget={mappedBudget}/>
        </>
    )
}