"use client"
import { useContext } from "react";
import DashboardView from "../components/Dashboard/DashboardView";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";

export default function Dashboard() {
    const context = useContext(InitialBudgetDataContext)
    const { mappedBudget, error} = context?.initialData;
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
                <DashboardView budget={mappedBudget} />
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