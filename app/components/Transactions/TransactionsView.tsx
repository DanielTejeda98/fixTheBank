"use client";
import {
  selectTransactions,
  useSetInitialStore,
} from "@/redux/features/budget-slice";
import { BudgetView, CategoryView, TransactionView } from "@/types/budget";
import FullSizeCard from "../Core/FullSizeCard";
import { useAppSelector } from "@/redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Drawer from "../Core/Drawer";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Core/Account";
import TransactionCard from "../TransactionCard";
import TransactionViewer from "./TransactionViewer";
import Filter from "./Filter";
import { Button } from "../ui/button";

export default function TransactionsView({ budget }: { budget: BudgetView }) {
  useSetInitialStore({ budget });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transactionView, settransactionView] = useState<
    TransactionView | undefined
  >(undefined);
  const [drawerComponent, setDrawerComponent] = useState("account");
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
        transaction={transactionView}
        closeDrawer={() => setIsDrawerOpen(false)}
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
  };

  type ComponentString =
    | "selectBudget"
    | "account"
    | "transactionViewer"
    | "filter";

  const toggleDrawer = (component: ComponentString) => {
    setDrawerComponent(component);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const openTransaction = (transaction: any) => {
    settransactionView(transaction);
    toggleDrawer("transactionViewer");
  };

  const renderTransactionsList = () => {
    return transactions
      .filter(
        (transaction) =>
          transaction.category && (filterBy.length > 0 ? filterBy.includes(transaction.category) : true)
      )
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
