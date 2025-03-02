import { BudgetView } from "@/types/budget";
import FullSizeCard from "../Core/FullSizeCard";
import { Button } from "../ui/button";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Core/Account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import SavingsManageAccounts from "./SavingsManageAccounts";
import { useAppSelector } from "@/redux/store";
import SavingsAccountCard from "./SavingsAccountCard";
import { SavingsAccount } from "@/types/savings";
import { useFTBDrawer } from "../ui/ftbDrawer";

export default function SavingsView({
  mappedBudget,
}: {
  mappedBudget: BudgetView;
}) {
  const savingsAccounts = useAppSelector((state) => state.savingsReducer.value.savingsAccounts);
  const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();

  const DrawerComponents = {
    selectBudget: <SelectBudget />,
    account: <Account />,
    savingsManageAccounts: <SavingsManageAccounts />
  };

  const openDrawer = (component: keyof typeof DrawerComponents) => {
    setDrawerComponent(DrawerComponents[component]);
    setDrawerOpen(true);
  };

  const renderSavingsAccountList = () => {
    return savingsAccounts.map((account: SavingsAccount) => (<SavingsAccountCard key={account._id} account={account} />))
  }

  return (
    <main className="w-full">
      <FullSizeCard>
        <div className="flex justify-between">
          <Button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => openDrawer("account")}
          >
            <FontAwesomeIcon icon={faUser} />
          </Button>
          <div className="text-center">
            <h1>Savings</h1>
          </div>
          <Button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => openDrawer("selectBudget")}
          >
            <FontAwesomeIcon icon={faGear} />
          </Button>
        </div>
      </FullSizeCard>

      <section className="flex flex-wrap mx-3 px-3 pb-3 border rounded-md">
        <div className="flex flex-wrap w-full mt-3 items-center">
          <h2 className="text-xl">Accounts</h2>
          <Button className="ml-auto" variant="outline" onClick={() => openDrawer("savingsManageAccounts")}>Manage account(s)</Button>
        </div>
        <ul className="mt-3 w-full">
          {renderSavingsAccountList()}
        </ul>
      </section>
    </main>
  );
}
