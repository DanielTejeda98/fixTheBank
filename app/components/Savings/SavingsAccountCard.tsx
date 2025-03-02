import { SavingsAccount } from "@/types/savings"
import { Button } from "../ui/button";
import { currencyFormat } from "@/app/lib/renderHelper";
import { useFTBDrawer } from "../ui/ftbDrawer";
import SavingsAccountView from "./SavingsAccountView";
import SavingsAddFunds from "./SavingsAddFunds";
import SavingsWithdrawFunds from "./SavingsWithdrawFunds";

interface SavingsAccountCardProps {
    account: SavingsAccount;
}

export default function SavingsAccountCard ({
    account
}: SavingsAccountCardProps) {
    const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();

    const handleAccountClick = () => {
      setDrawerComponent(<SavingsAccountView account={account} />)
      setDrawerOpen(true);
    }

    const handleOpenTransactionCreators = (buttonAction: "savingsAddFunds" | "savingsWithdrawFunds", e?: React.MouseEvent) => {
      e && e.stopPropagation();
      setDrawerComponent(buttonAction === "savingsAddFunds" ? <SavingsAddFunds account={account} /> : <SavingsWithdrawFunds account={account} />)
      setDrawerOpen(true);
    }

    return (
        <li
            className="flex flex-wrap items-center mb-2 p-2 gap-2 rounded-md border mb-3 last-of-type:mb-0"
            onClick={() => handleAccountClick()}
          >
            <div className="w-full">{account.name}</div>
            <div className="flex justify-between w-full">
              <div className="text-sm">
                <p>Funds: {currencyFormat(account.currentTotal)}</p>
              </div>
            </div>
            <Button onClick={(e:React.MouseEvent) => handleOpenTransactionCreators("savingsAddFunds", e)}>Add Funds</Button>
            <Button onClick={(e:React.MouseEvent) => handleOpenTransactionCreators("savingsWithdrawFunds", e)} variant="secondary">Withdraw Funds</Button>
          </li>
    )
}