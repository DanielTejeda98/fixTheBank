import { deleteIncome, deleteExpense } from "@/app/lib/budgetApi";
import { currencyFormat } from "@/app/lib/renderHelper";
import { useAppSelector } from "@/redux/store";
import { TransactionView } from "@/types/budget";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import ExpenseEditor from "../Dashboard/ExpenseEditor";

export default function TransactionViewer ({transaction}: {transaction?: TransactionView}) {
    const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();
    const userId = useSession().data?.user?.id;
    const categories = useAppSelector((state) => state.budgetReducer.value.categories)
    const accounts = useAppSelector((state) => state.budgetReducer.value.accounts)

    const account = accounts.find(acc => acc._id === transaction?.account)?.name;
    const category = categories.find(cat => cat._id === transaction?.category)?.name;

    const budgetId = useAppSelector((state) => state.budgetReducer.value._id);

    function openEditor () {
        setDrawerComponent(<ExpenseEditor budgetId={budgetId} accounts={accounts} categories={categories} transaction={transaction} />)
        setDrawerOpen(true);
    }

    const handleDeleteTransaction = async () => {
        if (!transaction) {
            return;
        }
        // If a transaction has a source field, it is an income transaction, otherwise, it is an expense transaction
        const deleteMethod = !!transaction.source ? deleteIncome : deleteExpense;
        try {
            await deleteMethod({userId}, transaction?._id)
            setDrawerOpen(false);
        } catch (error) {
            console.error(error)
        }
    }

    if (!transaction) {
        return;
    }
    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Transaction Details</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col">
                <h2>{transaction.description || transaction.source}</h2>
                <p>Amount: {currencyFormat(transaction.amount)}</p>
                {transaction.account ? <p>Account: {account}</p> : null}
                {transaction.category ? <p>Category: {category}</p> : null}
                {transaction.source ? <p>Income</p> : null}
                <p>Date: {new Date(transaction.transactionDate || transaction.date).toLocaleDateString("en-us", {timeZone: "UTC"})}</p>
                {transaction.receiptImage && <Link href={`/api/images/${budgetId}/${transaction.receiptImage}`} target="_blank"><Button type="button" variant={"outline"}>View receipt image</Button></Link>}
            </DrawerBody>
            <DrawerFooter className="w-full">
                <div className="flex w-full justify-end gap-2">
                    <Button variant="outline" className="rounded-md p-1 self-end min-w-32" onClick={() => openEditor()}>Edit</Button>
                    <Button variant="destructive" className="rounded-md p-1 self-end min-w-32" onClick={() => handleDeleteTransaction()}>Delete Transaction</Button>
                </div>
            </DrawerFooter>
        </>
    )
}