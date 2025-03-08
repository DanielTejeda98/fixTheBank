"use client"
import ManageAccount from "@/app/components/Settings/ManageAccount";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { useFTBDrawer } from "@/app/components/ui/ftbDrawer";
import { useAppSelector } from "@/redux/store";
import { AccountView } from "@/types/budget";
import Link from "next/link";

export default function SettingsBudgetAccounts () {
    const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();
    const accounts = useAppSelector((state) => state.budgetReducer.value.accounts);

    const handleManageAccount = (account?: AccountView) => {
        setDrawerComponent(<ManageAccount account={account} />)
        setDrawerOpen(true);
    }

    return (
        <div className="flex flex-col w-full p-2 gap-2">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-xl font-bold">Manage accounts</h1>
                <Link href="/settings"><Button variant={"ghost"}>Return to settings</Button></Link>
            </div>
            <Button onClick={() => handleManageAccount()}>Create account</Button>
            { accounts.map(account => (<button key={account._id}>
                <button onClick={() => handleManageAccount(account)} className="w-full">
                    <Card>
                        <CardContent>
                            {account.name}
                        </CardContent>
                    </Card>
                </button>
            </button>))}
        </div>
    )
}