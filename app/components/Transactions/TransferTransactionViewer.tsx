import { deleteTransfer } from "@/app/lib/budgetApi";
import { selectTransfers } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { useFTBDrawer } from "../ui/ftbDrawer";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser } from "@fortawesome/free-regular-svg-icons";
import { currencyFormat } from "@/app/lib/renderHelper";
import TransactionViewerDetailsLine from "./TransactionViewerDetailsLine";
import {
  faBank,
  faBucket,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";
import { selectSavingsAccounts } from "@/redux/features/savings-slice";
import TransferEditor from "../Dashboard/TransferEditor";

export default function TransferTransactionViewer({ id }: { id: string }) {
  const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();
  const transaction = useAppSelector(selectTransfers).find(
    (transfer) => transfer._id === id
  );
  const account = useAppSelector(selectSavingsAccounts).find(
    (sa) => sa._id === transaction?.account
  );
  const bucket = account?.buckets.find(
    (bkt) => bkt._id === transaction?.bucket
  );

  if (!transaction) {
    return null;
  }

  const handleOpenEditor = () => {
    setDrawerComponent(<TransferEditor transaction={transaction} />);
    setDrawerOpen(true);
  };

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransfer(transaction._id);
      setDrawerOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>Transfer Transaction</DrawerTitle>
      </DrawerHeader>
      <DrawerBody className="flex flex-col gap-3">
        <div className="flex w-full items-center justify-between pb-4 border-b-2 border-b-gray-800/75">
          <span
            className={`text-2xl ${
              transaction.transactionType === "withdraw"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {currencyFormat(transaction.amount)}
          </span>
          <div className="flex gap-4 items-center">
            <div className="flex rounded-full size-10 justify-center items-center bg-secondary">
              <FontAwesomeIcon icon={faCalendar} />
            </div>
            <div className="text-end">
              <p>
                {new Date(
                  transaction.date.toString().split("T")[0].replaceAll("-", "/")
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p className="text-muted-foreground text-sm">Transaction date</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <TransactionViewerDetailsLine
            icon={faDollarSign}
            label="Name"
            details={transaction.name}
          />
          <TransactionViewerDetailsLine
            icon={faBank}
            label="Account"
            details={account?.name || "N/A"}
          />
          <TransactionViewerDetailsLine
            icon={faBucket}
            label="Bucket"
            details={bucket?.name || "N/A"}
          />
          <TransactionViewerDetailsLine
            icon={faUser}
            label="Created By"
            details={transaction.createdBy.username}
          />
          <TransactionViewerDetailsLine
            icon={faUser}
            label="Updated By"
            details={transaction.updatedBy.username}
          />
        </div>
      </DrawerBody>

      <DrawerFooter>
        <div className="flex w-full justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-md p-1 self-end min-w-16"
            onClick={() => handleOpenEditor()}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            className="rounded-md p-1 self-end min-w-16"
            onClick={() => handleDeleteTransaction()}
          >
            Delete Transaction
          </Button>
        </div>
      </DrawerFooter>
    </>
  );
}
