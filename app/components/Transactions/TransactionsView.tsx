"use client";
import {
  selectTransactions,
  useSetInitialStore,
} from "@/redux/features/budget-slice";
import { BudgetView, TransactionView } from "@/types/budget";
import FullSizeCard from "../FullSizeCard";
import { useAppSelector } from "@/redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Drawer from "../Drawer";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Account";
import TransactionCard from "../TransactionCard";
import TransactionViewer from "./TransactionViewer";
import Filter from "./Filter";
import { Button } from "../ui/button";
import ExpenseEditor from "../Dashboard/ExpenseEditor";

export default function TransactionsView({ budget }: { budget: BudgetView }) {
  useSetInitialStore({ budget });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    TransactionView | undefined
  >(undefined);
  const [drawerComponent, setDrawerComponent] = useState("account" as keyof typeof DrawerComponents);
  const budgetMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate
  );
  const transactions = useAppSelector(selectTransactions) as [TransactionView];
  const categories = useAppSelector(
    (state) => state.budgetReducer.value.categories
  );
  const [filterBy, setFilterBy] = useState([] as string[]);

  const DrawerComponents = {
    selectBudget: <SelectBudget closeDrawer={() => setIsDrawerOpen(false)} />,
    account: <Account closeDrawer={() => setIsDrawerOpen(false)} />,
    transactionViewer: (
      <TransactionViewer
        transaction={selectedTransaction}
        closeDrawer={() => setIsDrawerOpen(false)}
        openEditor={() => setDrawerComponent("expenseEditor")}
      />
    ),
    filter: (
      <Filter
        categories={categories}
        filteredBy={filterBy}
        setFilteredBy={setFilterBy}
        closeDrawer={() => setIsDrawerOpen(false)}
      ></Filter>
    ),
    expenseEditor: <ExpenseEditor closeDrawer={() => setIsDrawerOpen(false)} budgetId={budget._id} accounts={budget.accounts} categories={budget.categories} transaction={selectedTransaction}/>,
  };

  const toggleDrawer = (component: keyof typeof DrawerComponents) => {
    setDrawerComponent(component);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const openTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    toggleDrawer("transactionViewer");
  };

  const renderTransactionsList = () => {
    return transactions
      .filter(
        (transaction) =>
          filterBy.length > 0 ? filterBy.includes(transaction.category || '') : true
      )
      .sort((a, b) => new Date(a.transactionDate || a.date).getTime() - new Date(b.transactionDate || b.date).getTime())
      .map((transaction) => (
        <TransactionCard
          key={transaction._id}
          transaction={transaction}
          onClick={() => openTransaction(transaction)}
        />
      ));
  };

  return (
    <main className="w-full">
      <FullSizeCard>
        <div className="flex justify-between">
          <button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => toggleDrawer("account")}
          >
            <FontAwesomeIcon icon={faUser} />
          </button>
          <p>
            Month:{" "}
            {new Date(budgetMonth).toLocaleDateString("en-us", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </p>
          <button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => toggleDrawer("selectBudget")}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </FullSizeCard>

      <div className="m-3 flex justify-between items-center">
        <h1>Transactions</h1>
        <Button variant="outline"
          className="text-xs"
          onClick={() => toggleDrawer("filter")}
        >
          Filter
        </Button>
      </div>

      <div className="flex flex-col gap-2 p-3 m-3 border border-slate-500 rounded-md">
        {renderTransactionsList()}
      </div>

      <Drawer isOpen={isDrawerOpen} closeDrawer={() => setIsDrawerOpen(false)}>
        {DrawerComponents[drawerComponent as keyof typeof DrawerComponents]}
      </Drawer>
    </main>
  );
}
