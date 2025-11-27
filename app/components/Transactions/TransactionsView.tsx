"use client";
import FullSizeCard from "../Core/FullSizeCard";
import { useAppSelector } from "@/redux/store";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Core/Account";
import Filter from "./Filter";
import { Button } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import TopOptions from "../Core/TopOptions";
import { formatDateDisplay } from "@/app/lib/renderHelper";
import { useGetMergedTransactionsList } from "./useGetMergedTransactionsList";
import Link from "next/link";

export default function TransactionsView() {
  const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();
  const budgetMonth = useAppSelector(
    (state) => state.budgetReducer.value.minDate
  );
  const transactions = useGetMergedTransactionsList();
  const filterByCategory = useAppSelector(
    (state) => state.filtersReducer.value.categoryFilters
  );
  const filterByAccount = useAppSelector(
    (state) => state.filtersReducer.value.accountFilters
  );

  const DrawerComponents = {
    selectBudget: <SelectBudget />,
    account: <Account />,
    filter: <Filter />,
  };

  const toggleDrawer = (component: keyof typeof DrawerComponents) => {
    setDrawerComponent(DrawerComponents[component]);
    setDrawerOpen(true);
  };

  const renderTransactionsList = () => {
    return transactions
      .filter(
        (transaction) =>
          (filterByCategory.length > 0
            ? filterByCategory.includes(transaction.categoryId || "")
            : true) &&
          (filterByAccount.length > 0
            ? filterByAccount.includes(transaction.accountId || "")
            : true)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((transaction) => transaction.transactionCard);
  };

  return (
    <main className="w-full">
      <FullSizeCard>
        <TopOptions>
          <p>Month: {formatDateDisplay(budgetMonth)}</p>
        </TopOptions>
      </FullSizeCard>

      <div className="m-3 flex justify-between items-center">
        <h1>Transactions</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => toggleDrawer("filter")}
          >
            Filter
          </Button>
          <Link href={"/transactions/reconcile"}>
            <Button variant={"secondary"} className="text-xs">
              Reconcile
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3 m-3 border border-slate-500 rounded-md">
        {renderTransactionsList()}
      </div>
    </main>
  );
}
