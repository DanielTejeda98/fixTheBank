"use client";
import FullSizeCard from "../Core/FullSizeCard";
import { CategoryView } from "@/types/budget";
import PlannerCategoriesList from "./PlannerCategoriesList";
import { useAppSelector } from "@/redux/store";
import PlannerIncomeList from "./PlannerIncomeList";
import PlannerSavingsList from "./PlannerSavingsList";
import TopOptions from "../Core/TopOptions";
import { formatDateDisplay } from "@/app/lib/renderHelper";

export default function PlannerView() {
  const budgetMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate
  );
  const monthPlannedIncome =
    useAppSelector(
      (state) =>
        state.budgetReducer.value.plannedIncome.find(
          (pi: any) => pi.month === budgetMonth
        )?.incomeStreams
    ) || [];
  const categories = useAppSelector(
    (state) => state.budgetReducer.value.categories
  ) as CategoryView[];

  return (
    <main className="w-full">
      <FullSizeCard>
        <div className="flex justify-between">
          <TopOptions>
            <div className="text-center">
              <h1>Planner</h1>
              <p className="text-sm">
                Planning for Month: <br /> {formatDateDisplay(budgetMonth)}
              </p>
            </div>
          </TopOptions>
        </div>
      </FullSizeCard>

      <PlannerIncomeList incomeStreams={monthPlannedIncome} />

      <PlannerCategoriesList categories={categories} />

      <PlannerSavingsList />
    </main>
  );
}
