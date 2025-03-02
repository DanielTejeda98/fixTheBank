import { useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import SavingsCreateAccount from "./SavingsCreateAccount";
import { DrawerBody, DrawerHeader, DrawerTitle } from "../ui/drawer";

export default function SavingsManageAccounts () {
    const { setDrawerComponent } = useFTBDrawer();
    const savingsAccounts = useAppSelector((state) => state.savingsReducer.value.savingsAccounts)

    const renderAccountsList = () => {
        return savingsAccounts.map((account, index) => (<li key={index}>{account.name}</li>))
    }

    return (
        <div className="flex flex-wrap overflow-scroll">
            <DrawerHeader className="flex flex-row justify-between items-center w-full">
                <DrawerTitle>
                    Manage Accounts
                </DrawerTitle>
                <Button onClick={() => setDrawerComponent(<SavingsCreateAccount />)}>Create account</Button>
            </DrawerHeader>
            <DrawerBody className="w-full flex flex-col mt-2">
                {renderAccountsList()}
            </DrawerBody>
        </div>
    )
}