import { currencyFormat } from "@/app/lib/renderHelper";
import {
  TransactionCard,
  TransactionCardDate,
  TransactionCardImage,
  TransactionCardLeftBody,
  TransactionCardProvider,
  TransactionCardRightBody,
  TransactionDescription,
} from "../TransactionCard";
import { useFTBDrawer } from "../ui/ftbDrawer";
import TransferTransactionViewer from "./TransferTransactionViewer";

export default function TransferTransactionCard({
  id,
  name,
  amount,
  date,
  type,
  account,
  bucket,
}: {
  id: string;
  name: string;
  amount: number;
  date: Date;
  type: "deposit" | "withdraw";
  account?: string;
  bucket?: string;
}) {
  const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();

  const handleCardClick = () => {
    setDrawerComponent(<TransferTransactionViewer id={id} />);
    setDrawerOpen(true);
  };

  return (
    <TransactionCardProvider>
      <TransactionCard onClick={handleCardClick}>
        <TransactionCardImage fallback="I" />
        <TransactionCardLeftBody>
          <p className="text-xs">Transfer</p>
          <TransactionDescription>{name}</TransactionDescription>
          <p className="text-xs">{account || "N/A"}</p>
          <p className="text-xs">{bucket || "N/A"}</p>
        </TransactionCardLeftBody>

        <TransactionCardRightBody>
          <p
            className={`text-right ${
              type === "withdraw" ? "text-green-500" : "text-red-500"
            }`}
          >
            {currencyFormat(amount)}
          </p>
          <TransactionCardDate date={date} />
        </TransactionCardRightBody>
      </TransactionCard>
    </TransactionCardProvider>
  );
}
