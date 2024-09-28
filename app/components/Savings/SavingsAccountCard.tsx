import { SavingsAccount } from "@/types/savings"
import { Button } from "../ui/button";
import { currencyFormat } from "@/app/lib/renderHelper";

interface SavingsAccountCardProps {
    account: SavingsAccount;
    handleAccountClick: (x: SavingsAccount) => void;
    openDrawer: (e: React.MouseEvent, x: "savingsAddFunds"|"savingsWithdrawFunds") => void;
}

export default function SavingsAccountCard ({
    account,
    handleAccountClick,
    openDrawer
}: SavingsAccountCardProps) {
    return (
        <li
            className="flex flex-wrap items-center mb-2 p-2 gap-2 rounded-md border mb-3 last-of-type:mb-0"
            onClick={() => handleAccountClick(account)}
          >
            <div className="w-full">{account.name}</div>
            <div className="flex justify-between w-full">
              <div className="text-sm">
                <p>Funds: {currencyFormat(account.currentTotal)}</p>
              </div>
            </div>
            <Button onClick={(e:any) => openDrawer(e, "savingsAddFunds")}>Add Funds</Button>
            <Button onClick={(e:any) => openDrawer(e, "savingsWithdrawFunds")} variant="secondary">Withdraw Funds</Button>
          </li>
    )
}