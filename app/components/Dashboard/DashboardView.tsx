"use client";
import { currencyFormat, formatDateDisplay } from "@/app/lib/renderHelper";
import { useAppSelector } from "@/redux/store";
import AddIncome from "./AddIncome";
import ExpenseEditor from "./ExpenseEditor";
import React from "react";
import FullSizeCard from "../Core/FullSizeCard";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import TopOptions from "../Core/TopOptions";
import { useGetMergedTransactionsList } from "../Transactions/useGetMergedTransactionsList";
import TransferEditor from "./TransferEditor";

export default function DashboardView() {
  const { openWithComponent } = useFTBDrawer();

  const budgetId = useAppSelector((state) => state.budgetReducer.value._id);
  const budgetMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate
  );
  const balance =
    useAppSelector((state) => state.budgetReducer.value.balance) || 0;
  const totalPlannedIncome =
    useAppSelector((state) => state.budgetReducer.value.totalPlannedIncome) ||
    0;
  const totalIncome =
    useAppSelector((state) => state.budgetReducer.value.totalIncome) || 0;
  const totalExpenses =
    useAppSelector((state) => state.budgetReducer.value.totalExpenses) || 0;
  const transactions = useGetMergedTransactionsList()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const DrawerComponents = {
    addIncome: <AddIncome budgetId={budgetId} />,
    expenseEditor: <ExpenseEditor budgetId={budgetId} />,
    transfer: <TransferEditor />,
  };

  const openDrawer = (component: keyof typeof DrawerComponents) => {
    openWithComponent(DrawerComponents[component]);
  };

  const renderTransactionsList = () => {
    return transactions.map((transaction) => transaction.transactionCard);
  };

  return (
    <main className="w-full bg-background text-primary">
      <FullSizeCard>
        <TopOptions>
          <p>Month: {formatDateDisplay(budgetMonth)}</p>
        </TopOptions>
        <div className="flex mt-5 pt-5 items-end">
          <div className="flex flex-wrap grow">
            <p className="w-full text-sm text-center">Account Balance</p>
            <p className="w-full text-xl text-center">
              {currencyFormat(balance)}
            </p>
          </div>
        </div>
        <div className="grid grid-flow-col mt-3 gap-2 text-xs">
          <div className="text-center p-2 grow border rounded-md shadow-xs">
            <p>Total income</p>
            <p>{currencyFormat(totalIncome)}</p>
          </div>
          <div className="text-center p-2 grow border rounded-md shadow-xs">
            <p>Expenses</p>
            <p>{currencyFormat(totalExpenses)}</p>
          </div>
          {/* <div className="text-center p-2 grow">
                        <p>Savings</p>
                        <p>$4,500.21</p>
                    </div>
                    <div className="text-center p-2 grow">
                        <p>Investment</p>
                        <p>$4,500.21</p>
                    </div> */}
        </div>
        <div className="flex justify-center gap-2 mt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => openDrawer("addIncome")}
          >
            (+) Add Income
          </Button>
          <Button type="button" onClick={() => openDrawer("transfer")}>
            Transfer
          </Button>
          <Button type="button" onClick={() => openDrawer("expenseEditor")}>
            (-) Add Expense
          </Button>
        </div>
      </FullSizeCard>

      <section className="m-3 p-3 border">
        <div className="flex justify-between items-center">
          <h2>Budget Summary</h2>
          <Link
            href="/planner"
            className={`${buttonVariants({ variant: "outline" })} text-xs`}
          >
            Manage budget
          </Link>
        </div>
        <div className="grid grid-rows-2 grid-flow-col gap-3 mt-3">
          <div className="flex items-center p-2 size-full gap-2 rounded-md border shadow-xs">
            <div>
              <p className="text-xs">Planned Income</p>
              <p>{currencyFormat(totalPlannedIncome)}</p>
            </div>
          </div>

          <div className="flex items-center p-2 size-full gap-2 rounded-md border shadow-xs">
            <div>
              <p className="text-xs">Remaining Budget</p>
              <p>{currencyFormat(totalPlannedIncome - totalExpenses)}</p>
            </div>
          </div>

          <div className="flex items-center p-2 size-full gap-2 rounded-md border shadow-xs">
            <div>
              <p className="text-xs">Budget Spent</p>
              <p>{currencyFormat(totalExpenses)}</p>
            </div>
          </div>

          <div className="flex items-center p-2 size-full gap-2 rounded-md border shadow-xs">
            <div>
              <p className="text-xs">Savings Percentage</p>
              <p>0%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="m-3 p-3 border">
        <div className="flex justify-between items-center">
          <h2>Transactions</h2>
          <Link
            href="/transactions"
            className={`${buttonVariants({ variant: "outline" })} text-xs`}
          >
            View all
          </Link>
        </div>

        <div className="grid gap-3 mt-3" data-qa="recent-transactions-list">
          {renderTransactionsList()}
        </div>
      </section>

      <section className="m-3 p-3 border">
        <div className="flex justify-between items-center">
          <h2>Links</h2>
        </div>

        <Link
          href="/year-in-review"
          className={`${buttonVariants({ variant: "outline" })} w-full`}
        >
          View your Year in Review
        </Link>
      </section>
    </main>
  );
}
