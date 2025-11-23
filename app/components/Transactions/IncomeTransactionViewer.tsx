import { deleteIncome } from "@/app/lib/budgetApi";
import { selectIncome } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser } from "@fortawesome/free-regular-svg-icons";
import { currencyFormat } from "@/app/lib/renderHelper";
import TransactionViewerDetailsLine from "./TransactionViewerDetailsLine";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";

export default function IncomeTransactionViewer ({ id }: { id: string }) {
    const { setOpen: setDrawerOpen } = useFTBDrawer()
    const transaction = useAppSelector(selectIncome).find(income => income._id === id);
    
    if (!transaction) {
        return null;
    }

    const handleDeleteTransaction = async () => {
        try {
            await deleteIncome(transaction._id);
            setDrawerOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Income Transaction</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col gap-3">
                <div className="flex w-full items-center justify-between pb-4 border-b-2 border-b-gray-800/75">
                    <span className="text-2xl text-green-500">{currencyFormat(transaction.amount)}</span>
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
                    <TransactionViewerDetailsLine icon={faDollarSign} label="Source" details={transaction.source} />
                    <TransactionViewerDetailsLine icon={faUser} label="Created By" details={transaction.createdBy.username} />
                    <TransactionViewerDetailsLine icon={faUser} label="Updated By" details={transaction.updatedBy.username} />
                </div>
            </DrawerBody>

            <DrawerFooter>
                <Button variant="destructive" className="rounded-md p-1 self-end min-w-16" onClick={() => handleDeleteTransaction()}>Delete Transaction</Button>
            </DrawerFooter>
        </>
    )
}