import { useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";

export default function SavingsManageAccounts ({openCreateAccount}: {openCreateAccount: () => void}) {
    const savingsAccounts = useAppSelector((state) => state.savingsReducer.value.savingsAccounts)

    const renderAccountsList = () => {
        return savingsAccounts.map(account => (<li>{account.name}</li>))
    }

    return (
        <div className="flex flex-wrap">
            <div className="flex justify-between items-center w-full">
                <h2 className="text-lg font-bold">
                    Manage Accounts
                </h2>
                <Button onClick={() => openCreateAccount()}>Create account</Button>
            </div>
            <div className="mt-2">
                {renderAccountsList()}
            </div>
        </div>
    )
}