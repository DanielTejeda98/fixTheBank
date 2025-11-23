import { deleteExpense } from "@/app/lib/budgetApi";
import { selectAccounts, selectCategories, selectExpense } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { currencyFormat } from "@/app/lib/renderHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCreditCard, faUser } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { Button } from "../ui/button";
import { faCircleInfo, faList } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import ExpenseEditor from "../Dashboard/ExpenseEditor";
import TransactionViewerDetailsLine from "./TransactionViewerDetailsLine";

export default function ExpenseTransactionViewer({ id }: { id: string }) {
    const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer()
    const userId = useSession().data?.user.id;
    const transaction = useAppSelector(selectExpense).find(expense => expense._id === id);
    const category = useAppSelector(selectCategories).find(cat => cat._id === transaction?.category)?.name || "";
    const account = useAppSelector(selectAccounts).find(acc => acc._id === transaction?.account)?.name || "";
    const budgetId = useAppSelector((state) => state.budgetReducer.value._id);
    if (!transaction) {
        return null;
    }

    const handleOpenEditor = () => {
        setDrawerComponent(<ExpenseEditor budgetId={budgetId} transaction={transaction} />)
        setDrawerOpen(true);
    }

    const handleDeleteTransaction = async () => {
        try {
            await deleteExpense(transaction._id);
            setDrawerOpen(false);
        } catch (error) {
            console.log(error);
        }
    }
    const isHiddenGiftTransaction = 
        transaction.giftTransaction &&
        transaction.revealGiftDate &&
        new Date(transaction.revealGiftDate) > new Date() &&
        userId !== transaction.createdBy._id.toString()

    const canEdit = !transaction.splitPaymentMasterId;

    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Expense Transaction</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className={cn("flex flex-col gap-3", {"blur-sm": isHiddenGiftTransaction})}>
                <div className="flex w-full items-center justify-between pb-4 border-b-2 border-b-gray-800/75">
                    <span className="text-2xl text-red-500">{currencyFormat(transaction.amount)}</span>
                    <div className="flex gap-4 items-center">
                        <div className="flex rounded-full size-10 justify-center items-center bg-secondary">
                            <FontAwesomeIcon icon={faCalendar} />
                        </div>
                        <div className="text-end">
                            <p>
                                {new Date(transaction.date).toLocaleDateString("en-US", {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric'
                                })}
                            </p>
                            <p className="text-muted-foreground text-sm">Transaction date</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2">
                    <TransactionViewerDetailsLine icon={faCircleInfo} label="Description" details={transaction.description} />
                    <TransactionViewerDetailsLine icon={faCreditCard} label="Account" details={account} />
                    <TransactionViewerDetailsLine icon={faList} label="Category" details={category} />
                    <TransactionViewerDetailsLine icon={faUser} label="Created By" details={transaction.createdBy.username} />
                    <TransactionViewerDetailsLine icon={faUser} label="Updated By" details={transaction.updatedBy.username} />
                </div>

                {transaction.receiptImage && <Link href={`/api/images/${budgetId}/${transaction.receiptImage}`} target="_blank"><Button type="button" variant={"outline"}>View receipt image</Button></Link>}

            </DrawerBody>
            <DrawerFooter>
                {canEdit ? (
                    <div className="flex w-full justify-end gap-2">
                        <Button variant="outline" className="rounded-md p-1 self-end min-w-16" onClick={() => handleOpenEditor()}>Edit</Button>
                        <Button variant="destructive" className="rounded-md p-1 self-end min-w-16" onClick={() => handleDeleteTransaction()}>Delete Transaction</Button>
                    </div>
                ) : null}
            </DrawerFooter>
        </>
    )
}