import { useState } from "react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { SavingsAccount, SavingsBuckets, SavingsTransaction } from "@/types/savings";
import { currencyFormat } from "@/app/lib/renderHelper";

export default function SavingsAccountView({
  account,
  closeDrawer,
  openCreateBucket
}: {
  account: SavingsAccount;
  closeDrawer: () => void;
  openCreateBucket: () => void;
}) {
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
    const firstElement = ledger.shift();

    let previousDate = "";
    const isSameDateAsPreviousTransaction = (date: string) => {
      return new Date(date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"}) === previousDate;
    }

    const renderDateAndUpdatePreviousRef = (date: string) => {
      previousDate = new Date(date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"})
      return (
        <div className="bg-slate-200 text-sm m-1 p-1 dark:bg-slate-700">
          <p>{ new Date(date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric", timeZone: "UTC"}) }</p>
        </div>
      )
    }
    const visibleRow = (
      <>
        <div>
          <p>{ renderDateAndUpdatePreviousRef(firstElement!.date) }</p>
        </div>
        <div className="border m-1 p-1 text-sm" key={0}>
          <p className="text-base font-bold">{ firstElement!.name }</p>
          <p>{firstElement!.transactionType === "withdraw" ? "-" : null}{ currencyFormat(firstElement!.amount || 0) }</p>
        </div>
      </>
    )
    const mappedRows = ledger.map((transaction:SavingsTransaction, index: number) => {
      const isWithdraw = transaction.transactionType === "withdraw";
      return (
        <>
          {!isSameDateAsPreviousTransaction(transaction.date) ? renderDateAndUpdatePreviousRef(transaction.date) : null}
          <div className="border m-1 p-1 text-sm" key={index + 1}>
            <p className="text-base font-bold">{ transaction.name }</p>
            <p className={isWithdraw ? "text-red-500" : ""}>{isWithdraw ? "-" : null}{ currencyFormat(transaction.amount || 0) }</p>
          </div>
        </>
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

  return (
    <div className="flex flex-wrap w-full">
      <h2 className="w-full">{ account.name }</h2>
      <div className="flex flex-wrap w-full mt-3">
        <div className="ml-auto flex gap-2">
          <Button onClick={() => openCreateBucket()}>Create bucket</Button>
          <Button variant="secondary">Distribute</Button>
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
      </div>
    </div>
  );
}
