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

  const DrawerComponents = {
    selectBudget: <SelectBudget closeDrawer={() => setIsDrawerOpen(false)} />,
    account: <Account closeDrawer={() => setIsDrawerOpen(false)} />,
    transactionViewer: (
      <TransactionViewer
        transaction={transactionView}
        closeDrawer={() => setIsDrawerOpen(false)}
      />
    ),
  };

  type ComponentString = "selectBudget" | "account" | "transactionViewer";

  const toggleDrawer = (component: ComponentString) => {
    setDrawerComponent(component);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const openTransaction = (transaction: any) => {
    settransactionView(transaction);
    toggleDrawer("transactionViewer");
  };

  const renderTransactionsList = () => {
    return transactions.map((transaction) => (
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
            className="bg-slate-500 p-2 w-10 h-10 text-center rounded-full"
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
            className="bg-slate-500 p-2 w-10 h-10 text-center rounded-full"
            onClick={() => toggleDrawer("selectBudget")}
          >
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </FullSizeCard>

      <div className="m-3 flex flex-col">
        <h1>Transactions</h1>
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
