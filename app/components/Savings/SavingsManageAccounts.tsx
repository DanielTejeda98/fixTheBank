import { Button } from "../ui/button";

export default function SavingsManageAccounts ({openCreateAccount}: {openCreateAccount: () => void}) {
    return (
        <div className="flex flex-wrap">
            <div className="flex justify-between items-center w-full">
                <h2 className="text-lg font-bold">
                    Manage Accounts
                </h2>
                <Button onClick={() => openCreateAccount()}>Create account</Button>
            </div>
            <div className="mt-2">
                Render accounts list
            </div>
        </div>
    )
}