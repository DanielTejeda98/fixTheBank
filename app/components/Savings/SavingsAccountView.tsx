import { useState } from "react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { SavingsAccount, SavingsBuckets, SavingsTransaction } from "@/types/savings";
import { currencyFormat } from "@/app/lib/renderHelper";
import { DrawerBody, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useFTBDrawer } from "../ui/ftbDrawer";
import SavingsCreateAccountBucket from "./SavingsCreateAccountBucket";
import SavingsTransactionCard from "./SavingsTransactionCard";

export default function SavingsAccountView({
  account
}: {
  account: SavingsAccount;
}) {
  const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();
  const [isBucketsExpanded, setBucketExpanded] = useState(false);
  const [isTransactionsExpanded, setTransactionsExpanded] = useState(false);

  const renderBuckets = () => {
    // We need to make a copy of the array to help us massage it and avoid errors due to the account.buckets being immutable
    // We later on add 1 to the index to take into account the fact that we removed the first element to display it differently
    const buckets = [...account.buckets];
    const firstElement = buckets.shift();
    const visibleRow = (
      <div className="border m-1 p-1 text-sm" key={0}>
        <p className="text-base font-bold">{ firstElement!.name }</p>
        <p>Goal: { currencyFormat(firstElement!.goal || 0) }</p>
        <p>Current Funds: { currencyFormat(firstElement!.currentTotal || 0) }</p>
      </div>
    )
    const mappedRows = buckets.map((bucket:SavingsBuckets, index: number) => {
      return (
        <div className="border m-1 p-1 text-sm" key={index + 1}>
          <p className="text-base font-bold">{ bucket.name }</p>
          <p>Goal: { currencyFormat(bucket.goal) }</p>
          <p>Current Funds: { currencyFormat(bucket.currentTotal) }</p>
        </div>
      )
    })

    return (
      <>
        {visibleRow}
        <CollapsibleContent>
          {mappedRows}
        </CollapsibleContent>
      </>
    )
  }

  const renderLedger = () => {
    // We need to make a copy of the array to help us massage it and avoid errors due to the account.buckets being immutable
    // We later on add 1 to the index to take into account the fact that we removed the first element to display it differently
    if (!account.ledger || account.ledger.length === 0) {
      return null;
    }
    const ledger = [...account.ledger].reverse().sort((a, b) => new Date(b.date).getDate() - new Date(a.date).getDate());
    // The ledger should not be null at this point, so we can force TS to accept the element will be there
    const firstElement = ledger.shift()!;

    let previousDate = "";
    const isSameDateAsPreviousTransaction = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"}) === previousDate;
    }

    const renderDateAndUpdatePreviousRef = (date: string) => {
      previousDate = new Date(date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"})
      return (
        <p className="bg-slate-200 text-sm m-1 p-1 dark:bg-slate-700">
          <span>{ new Date(date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"}) }</span>
        </p>
      )
    }

    // Render the first row, since this is always visible, we handle this case seperately
    const visibleRow = (
      <>
        <div>{ renderDateAndUpdatePreviousRef(firstElement!.date) }</div>
        <SavingsTransactionCard transaction={firstElement} key={0} />
      </>
    )
    // Handle collapsed rows
    const mappedRows = ledger.map((transaction:SavingsTransaction, index: number) => {
      return (
        <div key={index}>
          {!isSameDateAsPreviousTransaction(transaction.date) ? renderDateAndUpdatePreviousRef(transaction.date) : null}
          <SavingsTransactionCard transaction={transaction} key={index + 1} />
        </div>
      )
    })

    return (
      <>
        {visibleRow}
        <CollapsibleContent>
          {mappedRows}
        </CollapsibleContent>
      </>
    )
  }

  const openCreateBucket = (e: React.MouseEvent | null) => {
    e?.stopPropagation();
    setDrawerComponent(<SavingsCreateAccountBucket savingsAccountId={account._id} />);
    setDrawerOpen(true);
  };

  return (
    <div className="flex flex-wrap w-full overflow-scroll">
      <DrawerHeader>
        <DrawerTitle>{ account.name }</DrawerTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-wrap w-full mt-3">
        <div className="ml-auto flex gap-2">
          <Button onClick={(e) => openCreateBucket(e)}>Create bucket</Button>
        </div>
        <Collapsible
          className="w-full mt-3"
          open={isBucketsExpanded}
          onOpenChange={setBucketExpanded}
        >
          <div className="flex w-full items-center">
            <h3>Buckets</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="ml-auto">
                {isBucketsExpanded ? "Show less" : "Show all"}
              </Button>
            </CollapsibleTrigger>
          </div>
          { renderBuckets() }
        </Collapsible>

        <Collapsible
          className="w-full mt-3"
          open={isTransactionsExpanded}
          onOpenChange={setTransactionsExpanded}
        >
          <div className="flex w-full items-center">
            <h3>Transactions</h3>
            <CollapsibleTrigger asChild>
            {account.ledger.length > 1 
            ? (
                <Button variant="ghost" className="ml-auto">
                  {isTransactionsExpanded ? "Show less" : "Show all"}
                </Button>
              )
            : null}
              
            </CollapsibleTrigger>
          </div>
          { renderLedger() }
        </Collapsible>
      </DrawerBody>
    </div>
  );
}
