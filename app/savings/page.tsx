"use client";
import { useContext, useEffect } from "react";
import { redirect } from "next/navigation";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";
import SavingsView from "../components/Savings/SavingsView";
import { getSavings } from "../lib/savingsApi";

export default function Savings() {
  const context = useContext(InitialBudgetDataContext);
  const { mappedBudget, error } = context?.initialData;
  // TODO: this should be a part of the initial data load
  useEffect(() => {
    getSavings();
  })
  
  if (error) {
    redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
  }

  return (
    <>
      <SavingsView mappedBudget={mappedBudget}></SavingsView>
    </>
  );
}
