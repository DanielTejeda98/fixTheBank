"use client";
import { useContext } from "react";
import { redirect } from "next/navigation";
import { InitialBudgetDataContext } from "../providers/BudgetProvider";
import SavingsView from "../components/Savings/SavingsView";

export default function Savings() {
  const context = useContext(InitialBudgetDataContext);
  const { mappedBudget, error } = context?.initialData;

  if (error) {
    redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
  }

  return (
    <>
      <SavingsView mappedBudget={mappedBudget}></SavingsView>
    </>
  );
}
