import { useSession } from "next-auth/react";
import { TransactionCard, TransactionCardDate, TransactionCardImage, TransactionCardLeftBody, TransactionCardProvider, TransactionCardRightBody, TransactionDescription } from "../TransactionCard";
import { Badge } from "../ui/badge";
import { currencyFormat } from "@/app/lib/renderHelper";
import { useMemo } from "react";
import { useFTBDrawer } from "../ui/ftbDrawer";
import ExpenseTransactionViewer from "./ExpenseTransactionViewer";

interface ExpenseTransactionCardProps {
    id: string;
    name: string;
    amount: number;
    accountName: string;
    categoryName: string;
    date: Date;
    isBorrowFromNextMonth: boolean;
    isGiftTransaction: boolean;
    isSplitTransaction: boolean;
    createdById: string;
    revealDate?: Date | null;
}

export default function ExpenseTransactionCard({
    id,
    name,
    amount,
    accountName,
    categoryName,
    date,
    isBorrowFromNextMonth,
    isGiftTransaction,
    isSplitTransaction,
    revealDate,
    createdById
}: ExpenseTransactionCardProps) {
    const { setDrawerComponent, setOpen: setDrawerOpen } = useFTBDrawer();
    const userId = useSession().data?.user.id;
    const badges = useMemo(() => ({
        Borrowed: isBorrowFromNextMonth,
        Gift: isGiftTransaction,
        Split: isSplitTransaction
    }), [isBorrowFromNextMonth, isGiftTransaction, isSplitTransaction])

    const handleCardClick = () => {
        setDrawerComponent(<ExpenseTransactionViewer id={id} />);
        setDrawerOpen(true);
    }

    const mappedBadges = () => {
        const _badges = Object.entries(badges)
            .filter((badge) => badge[1])
            .map((badge) => badge[0])

        console.log(_badges)

        if (!_badges.length) return null;

        return (
            <div className="flex gap-1">
                {
                    _badges.map((badge, index) => (
                        <Badge key={index}>{badge}</Badge>
                    ))
                }
            </div>
        )
    }

    const isHiddenGiftTransaction = 
        (isGiftTransaction && 
        revealDate && 
        revealDate > new Date() && 
        userId !== createdById) ?? false;

    return (
        <TransactionCardProvider isBlurredContent={isHiddenGiftTransaction}>
            <TransactionCard onClick={handleCardClick}>
                <TransactionCardImage fallback={categoryName.substring(0,2).toUpperCase()} />
                <TransactionCardLeftBody>
                    { mappedBadges() }
                    <p className="text-xs">{categoryName}</p>
                    <TransactionDescription>
                        {name}
                    </TransactionDescription>
                    <p className="text-xs">{accountName}</p>
                </TransactionCardLeftBody>
                <TransactionCardRightBody>
                    <p className="text-right text-red-500">{currencyFormat(amount)}</p>
                    <TransactionCardDate date={date} />
                </TransactionCardRightBody>
            </TransactionCard>
        </TransactionCardProvider>
    )
}