import { BudgetView } from "@/types/budget";
import FullSizeCard from "../FullSizeCard";
import { Button } from "../ui/button";
import Drawer from "../Drawer";
import { useState } from "react";
import SelectBudget from "../Dashboard/SelectBudget";
import Account from "../Account";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import SavingsAccountView from "./SavingsAccountView";

export default function SavingsView({
  mappedBudget,
}: {
  mappedBudget: BudgetView;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerComponent, setDrawerComponent] = useState(
    "addIncome" as keyof typeof DrawerComponents
  );

  const DrawerComponents = {
    selectBudget: <SelectBudget closeDrawer={() => setIsDrawerOpen(false)} />,
    account: <Account closeDrawer={() => setIsDrawerOpen(false)} />,
    savingsAccount: (
      <SavingsAccountView
        closeDrawer={() => setIsDrawerOpen(false)}
      ></SavingsAccountView>
    ),
  };

  const toggleDrawer = (component: keyof typeof DrawerComponents) => {
    setDrawerComponent(component);
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <main className="w-full">
      <FullSizeCard>
        <div className="flex justify-between">
          <Button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => toggleDrawer("account")}
          >
            <FontAwesomeIcon icon={faUser} />
          </Button>
          <div className="text-center">
            <h1>Savings</h1>
          </div>
          <Button
            className="p-2 w-10 h-10 text-center rounded-full"
            onClick={() => toggleDrawer("selectBudget")}
          >
            <FontAwesomeIcon icon={faGear} />
          </Button>
        </div>
      </FullSizeCard>

      <section className="flex flex-wrap mx-3 px-3 pb-3 border rounded-md">
        <div className="flex flex-wrap w-full mt-3 items-center">
          <h2 className="text-xl">Accounts</h2>
          <Button className="ml-auto">Create account</Button>
        </div>
        <ul className="mt-3 w-full">
          <li
            className="flex flex-wrap items-center mb-2 p-2 gap-2 rounded-md border mb-3 last-of-type:mb-0"
            onClick={() => toggleDrawer("savingsAccount")}
          >
            <div className="w-full">Account 1</div>
            <div className="flex justify-between w-full">
              <div className="text-sm">
                <p>Funds: $200</p>
              </div>
            </div>
            <Button>Add Funds</Button>
            <Button variant="secondary">Withdraw Funds</Button>
          </li>

          <li className="flex flex-wrap items-center mb-2 p-2 gap-2 rounded-md border mb-3 last-of-type:mb-0">
            <div className="w-full">Account 2</div>
            <div className="flex justify-between w-full">
              <div className="text-sm">
                <p>Funds: $200</p>
              </div>
            </div>
          </li>
        </ul>
      </section>

      <Drawer isOpen={isDrawerOpen} closeDrawer={() => setIsDrawerOpen(false)}>
        {DrawerComponents[drawerComponent]}
      </Drawer>
    </main>
  );
}
