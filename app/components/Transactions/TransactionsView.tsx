"use client";
import {
  selectTransactions,
} from "@/redux/features/budget-slice";
import { TransactionView } from "@/types/budget";
import FullSizeCard from "../Core/FullSizeCard";
import { useAppSelector } from "@/redux/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Core/Account";
import TransactionCard from "../TransactionCard";
import Filter from "./Filter";
import { Button } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function TransactionsView() {
  const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();
  const budgetMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate
  );
  const transactions = useAppSelector(selectTransactions) as [TransactionView];

  const filterByCategory = useAppSelector((state) => state.filtersReducer.value.categoryFilters)
  const filterByAccount = useAppSelector((state) => state.filtersReducer.value.accountFilters);

  const DrawerComponents = {
    selectBudget: <SelectBudget />,
    account: <Account />,
    filter: (
      <Filter />
    ),
  };

  const toggleDrawer = (component: keyof typeof DrawerComponents) => {
    setDrawerComponent(DrawerComponents[component]);
    setDrawerOpen(true);
  };

  const renderTransactionsList = () => {
    return transactions
      .filter(
        (transaction) =>
          (filterByCategory.length > 0 ? filterByCategory.includes(transaction.category || '') : true) &&
          (filterByAccount.length > 0 ? filterByAccount.includes(transaction.account || '') : true)
      )
      .sort((a, b) => new Date(a.transactionDate || a.date).getTime() - new Date(b.transactionDate || b.date).getTime())
      .map((transaction) => (
        <TransactionCard
          key={transaction._id}
          transaction={transaction}
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
            <FontAwesomeIcon icon={faCalendar} />
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
    </main>
  );
}
