"use client";

import { formatDateDisplay } from "@/app/lib/renderHelper";
import FullSizeCard from "../../Core/FullSizeCard";
import TopOptions from "../../Core/TopOptions";
import { useAppSelector } from "@/redux/store";
import {
  selectAccounts,
  selectCategories,
  selectExpense,
  selectIncome,
} from "@/redux/features/budget-slice";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { CollapsibleTrigger } from "../../ui/collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { ExpenseTransaction } from "@/types/budget";
import ReconcileExpenseTransactionCard from "./ReconcileExpenseTransactionCard";
import ReconcileIncomeTransactionCard from "./ReconcileIncomeTransactionCard";
import { Button } from "../../ui/button";
import AddIncome from "../../Dashboard/AddIncome";
import ExpenseEditor from "../../Dashboard/ExpenseEditor";
import { useFTBDrawer } from "../../ui/ftbDrawer";
import ReconcileAccountCollapse from "./ReconcileAccountCollapse";
import ReconcileIncomeCollapse from "./ReconcileIncomeCollapse";

export default function ReconcileView() {
  const { openWithComponent } = useFTBDrawer();
  const [accountsWithTransactionsMap, setAccountsWithTransactionsMap] =
    useState<Map<string, ExpenseTransaction[]>>(new Map());
  const budgetMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate
  );
  const budgetId = useAppSelector((state) => state.budgetReducer.value._id);
  const accounts = useAppSelector(selectAccounts);
  const categories = useAppSelector(selectCategories);
  const expenseTransactions = useAppSelector(selectExpense);
  const incomeTransactions = useAppSelector(selectIncome);

  useEffect(() => {
    const accountMap = new Map<string, ExpenseTransaction[]>();
    expenseTransactions.forEach((expense) => {
      const account = accountMap.get(expense.account);
      if (!!account) account.push(expense);
      else accountMap.set(expense.account, [expense]);
    });
    setAccountsWithTransactionsMap(accountMap);
  }, [expenseTransactions, setAccountsWithTransactionsMap]);

  const DrawerComponents = {
    addIncome: <AddIncome budgetId={budgetId} />,
    expenseEditor: <ExpenseEditor budgetId={budgetId} />,
  };

  const openDrawer = (component: keyof typeof DrawerComponents) => {
    openWithComponent(DrawerComponents[component]);
  };

  return (
    <main className="w-full">
      <FullSizeCard>
        <TopOptions>
          <p>Month: {formatDateDisplay(budgetMonth)}</p>
        </TopOptions>
      </FullSizeCard>

      <div className="m-3 flex justify-between items-center">
        <h1>Reconcile Transactions</h1>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        <Button variant="secondary" onClick={() => openDrawer("addIncome")}>
          (+) Add funds
        </Button>
        <Button onClick={() => openDrawer("expenseEditor")}>
          (-) Add Expense
        </Button>
      </div>

      <ReconcileIncomeCollapse incomeTransactions={incomeTransactions} />

      {accounts.map((account, index) => (
        <ReconcileAccountCollapse
          key={`accounts_${index}`}
          transactions={accountsWithTransactionsMap.get(account._id)}
          name={account.name}
        />
      ))}
    </main>
  );
}
