import { useState } from "react";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export default function SavingsAccountView({
  closeDrawer,
  openCreateBucket
}: {
  closeDrawer: () => void;
  openCreateBucket: () => void;
}) {
  const [isBucketsExpanded, setBucketExpanded] = useState(false);
  const [isTransactionsExpanded, setTransactionsExpanded] = useState(false);

  return (
    <div className="flex flex-wrap w-full">
      <h2 className="w-full">Account 1</h2>
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
          <div className="border m-1 p-1 text-sm">
            <p className="text-base font-bold">Core</p>
            <p>Goal: $200</p>
            <p>Current Funds: $150</p>
          </div>
          <CollapsibleContent>
            <div className="border m-1 p-1 text-sm">
              <p className="text-base font-bold">Car Insurance</p>
              <p>Goal: $2000</p>
              <p>Current Funds: $2075</p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          className="w-full mt-3"
          open={isTransactionsExpanded}
          onOpenChange={setTransactionsExpanded}
        >
          <div className="flex w-full items-center">
            <h3>Transactions</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="ml-auto">
                {isTransactionsExpanded ? "Show less" : "Show all"}
              </Button>
            </CollapsibleTrigger>
          </div>
          <div className="border m-1 p-1 text-sm">
            <p className="text-base font-bold">Income</p>
            <p>May 21st 2024</p>
            <p>$2100.00</p>
          </div>
          <CollapsibleContent>
            <div className="border m-1 p-1 text-sm">
              <p className="text-base font-bold">Withdraw</p>
              <p>May 21st 2024</p>
              <p>$2100.00</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
