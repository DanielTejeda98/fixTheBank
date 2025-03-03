import { currencyFormat } from "@/app/lib/renderHelper";
import { SavingsBuckets } from "@/types/savings";

export default function SavingsBucketCard ({bucket}: {bucket: SavingsBuckets}) {
    return (
        <div className="border m-1 p-1 text-sm">
          <p className="text-base font-bold">{ bucket.name }</p>
          <p>Goal: { currencyFormat(bucket.goal || 0) }</p>
          <p>Current Funds: { currencyFormat(bucket.currentTotal) }</p>
        </div>
    )
}