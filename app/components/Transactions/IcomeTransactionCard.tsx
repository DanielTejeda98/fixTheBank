import { currencyFormat } from "@/app/lib/renderHelper";
import { TransactionCard, TransactionCardDate, TransactionCardImage, TransactionCardLeftBody, TransactionCardProvider, TransactionCardRightBody, TransactionDescription } from "../TransactionCard";
import { useFTBDrawer } from "../ui/ftbDrawer";
import IncomeTransactionViewer from "./IncomeTransactionViewer";

export default function IncomeTransactionCard({
    id,
    name,
    amount,
    date
}: {
    id: string
    name: string
    amount: number
    date: Date
}) {
    const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();

    const handleCardClick = () => {
        setDrawerComponent(<IncomeTransactionViewer id={id} />);
        setDrawerOpen(true);
    }

    return (
        <TransactionCardProvider>
            <TransactionCard onClick={handleCardClick}>
                <TransactionCardImage fallback="I" />
                <TransactionCardLeftBody>
                    <p className="text-xs">Income</p>
                    <TransactionDescription>
                        {name}
                    </TransactionDescription>
                </TransactionCardLeftBody>

                <TransactionCardRightBody>
                    <p className="text-right text-green-500">
                        {currencyFormat(amount)}
                    </p>
                    <TransactionCardDate date={date} />
                </TransactionCardRightBody>
            </TransactionCard>
        </TransactionCardProvider>
    )
}