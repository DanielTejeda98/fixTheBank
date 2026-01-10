"use client";

import { YearBudgetReviewData } from "@/controllers/budgetController";
import FullSizeCard from "../Core/FullSizeCard";
import TopOptions from "../Core/TopOptions";
import { currencyFormat } from "@/app/lib/renderHelper";
import MonthlyBreakdownChart from "./MonthlyBreakdownChart/MonthlyBreakdownChart";
import BreakdownChart from "./BreakdownChart/BreakdownChart";
import CategoryPlannedVsActualChart from "./CategoryPlannedVsActualChart/CategoryPlannedVsActualChart";
import YearSelector from "./YearSelector/YearSelector";

export default function YearInReview({
  yearInReviewData,
}: {
  yearInReviewData: NonNullable<Awaited<YearBudgetReviewData>>;
}) {
  return (
    <main className="w-full">
      <FullSizeCard>
        <div className="flex justify-between">
          <TopOptions>
            <div className="text-center">
              <h1>Year in Review</h1>
              <YearSelector
                year={yearInReviewData.year}
                startYear={yearInReviewData.startYear}
              />
            </div>
          </TopOptions>
        </div>

        <div className="flex mt-5 pt-5 items-end">
          <div className="flex flex-wrap grow">
            <p className="w-full text-sm text-center">Year Balance</p>
            <p className="w-full text-xl text-center">
              {currencyFormat(yearInReviewData?.balance || 0)}
            </p>
          </div>
        </div>
      </FullSizeCard>

      <section className="m-3 flex flex-col gap-3">
        <MonthlyBreakdownChart
          incomeTotalBreakdown={yearInReviewData?.monthlyIncomeTotalBreakdown}
          expenseTotalBreakdown={yearInReviewData?.monthlyExpenseTotalBreakdown}
        />

        <BreakdownChart
          title="Category Breakdown"
          expenseBreakdown={yearInReviewData?.categoryTotalsExpenseBreakdown}
        />

        <BreakdownChart
          title="Account Breakdown"
          expenseBreakdown={yearInReviewData?.accountTotalsExpenseBreakdown}
        />

        <CategoryPlannedVsActualChart
          data={yearInReviewData?.categoryTotalsExpenseBreakdown}
        />
      </section>
    </main>
  );
}
