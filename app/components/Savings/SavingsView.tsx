import { BudgetView } from "@/types/budget";
import FullSizeCard from "../Core/FullSizeCard";
import { Button } from "../ui/button";
import Drawer from "../Core/Drawer";
import { useState } from "react";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Core/Account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import SavingsAccountView from "./SavingsAccountView";
import SavingsAddFunds from "./SavingsAddFunds";
import SavingsWithdrawFunds from "./SavingsWithdrawFunds";
import SavingsCreateAccount from "./SavingsCreateAccount";
import SavingsManageAccounts from "./SavingsManageAccounts";
import SavingsCreateAccountBucket from "./SavingsCreateAccountBucket";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import SavingsAccountCard from "./SavingsAccountCard";
import { SavingsAccount } from "@/types/savings";

export default function SavingsView({
  mappedBudget,
}: {
  mappedBudget: BudgetView;
}) {
  const router = useRouter();
  const enableSavingsBeta = useAppSelector((state) => state.settingsReducer.value.enableSavingsBeta);

  const savingsAccounts = useAppSelector((state) => state.savingsReducer.value.savingsAccounts);
  if (!enableSavingsBeta) {
    router.push("/");
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({} as SavingsAccount);
  const [drawerComponent, setDrawerComponent] = useState(
    "addIncome" as keyof typeof DrawerComponents
  );

  const DrawerComponents = {
    selectBudget: <SelectBudget closeDrawer={() => setIsDrawerOpen(false)} />,
    account: <Account closeDrawer={() => setIsDrawerOpen(false)} />,
    savingsAccount: <SavingsAccountView account={selectedAccount} closeDrawer={() => setIsDrawerOpen(false)} openCreateBucket={() => openDrawer(null, "savingsCreateAccountBucket")} />,
    savingsAddFunds: <SavingsAddFunds closeDrawer={() => setIsDrawerOpen(false)} />,
    savingsWithdrawFunds: <SavingsWithdrawFunds closeDrawer={() => setIsDrawerOpen(false)} />,
    savingsCreateAccount: <SavingsCreateAccount closeDrawer={() => setIsDrawerOpen(false)} />,
    savingsManageAccounts: <SavingsManageAccounts openCreateAccount={() => openDrawer(null, "savingsCreateAccount")}/>,
    savingsCreateAccountBucket: <SavingsCreateAccountBucket closeDrawer={() => setIsDrawerOpen(false)} savingsAccountId={selectedAccount._id}/>
  };

  const openDrawer = (e: React.MouseEvent|null, component: keyof typeof DrawerComponents) => {
    e?.stopPropagation();
    setDrawerComponent(component);
    setIsDrawerOpen(true);
  };

  const handleAccountClick = (account: SavingsAccount) => {
    setSelectedAccount(account);
    openDrawer(null, "savingsAccount");
  }

  const renderSavingsAccountList = () => {
    return savingsAccounts.map(account => (<SavingsAccountCard key={account._id} account={account} handleAccountClick={handleAccountClick} openDrawer={openDrawer}></SavingsAccountCard>))
  } 

  return (
    <main className="w-full">
      <FullSizeCard>
        <div className="flex justify-between">
          <Button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => openDrawer(null, "account")}
          >
            <FontAwesomeIcon icon={faUser} />
          </Button>
          <div className="text-center">
            <h1>Savings</h1>
          </div>
          <Button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => openDrawer(null, "selectBudget")}
          >
            <FontAwesomeIcon icon={faGear} />
          </Button>
        </div>
      </FullSizeCard>

      <section className="flex flex-wrap mx-3 px-3 pb-3 border rounded-md">
        <div className="flex flex-wrap w-full mt-3 items-center">
          <h2 className="text-xl">Accounts</h2>
          <Button className="ml-auto" variant="outline" onClick={() => openDrawer(null, "savingsManageAccounts")}>Manage account(s)</Button>
        </div>
        <ul className="mt-3 w-full">
          {renderSavingsAccountList()}
        </ul>
      </section>

      <Drawer isOpen={isDrawerOpen} closeDrawer={() => setIsDrawerOpen(false)}>
        {DrawerComponents[drawerComponent]}
      </Drawer>
    </main>
  );
}
