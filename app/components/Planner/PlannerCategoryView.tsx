import useReactValidator from "@/app/hooks/useReactValidator";
import { deleteCategory, updateCategory } from "@/app/lib/categoriesApi";
import { currencyFormat } from "@/app/lib/renderHelper";
import { selectUnallocatedFunds } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { CategoryView } from "@/types/budget"
import { useSession } from "next-auth/react";
import { useReducer, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { Textarea } from "../ui/textarea";

export default function PlannerCategoryView ({category}: {category?: CategoryView}) {
    const { setOpen: setDrawerOpen } = useFTBDrawer();
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const currentMonth = useAppSelector((state) => state.budgetReducer.value.minDate);
    const unallocatedFunds = useAppSelector((state) => selectUnallocatedFunds(state));
    
    // Get last month planned amount
    const lastMonth = new Date(currentMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1, 1);
    const lastMonthString = lastMonth.toLocaleString("en-us", {dateStyle: "short"});
    const previousMonthPlannedAmount = category?.maxMonthExpectedAmount.find((planned: {month: string, amount: number}) => {
        if (planned.month === lastMonthString) {
            return true;
        }
    })?.amount || 0;

    const [maxAmount, setMaxAmount] = useState(category?.maxMonthExpectedAmount.find((c) => c.month === currentMonth)?.amount as Number)
    const [note, setNote] = useState(category?.notes.find(n => n.month === currentMonth)?.note || "");

    const getMaxAmount = () => {
        const amount = maxAmount.toString();
        if (amount.includes('.') && amount.split('.')[1].length > 2) {
            const splitString = amount.split('.');
            const correctedString = `${splitString[0]}.${splitString[1].substring(0,2)}`;
            setMaxAmount(Number(correctedString));
            return correctedString;
        } 
        return amount;
    }

    const handleSubmitClick = async () => {
        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }
        try {
            await updateCategory({userId}, {
                _id: category?._id,
                name: category?.name,
                sortRank: 0,
                date: currentMonth,
                amount: maxAmount,
                note: note
            })
        } catch (error) {
            console.log(error)
        }
        setDrawerOpen(false);
    }

    const handleDeleteClick = async () => {
        try {
            if (!category) return;

            await deleteCategory({userId}, category?._id)
        } catch (error) {
            console.log(error)
        }
        setDrawerOpen(false)
    }

    if (!category) return;

    return (
        <div className="flex flex-col w-full overflow-scroll">
            <DrawerHeader>
                <DrawerTitle>{category.name}</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col w-full">
                <div className="mt-2 p-2 w-full border rounded-md border-slate-500">
                    <p>Remaining unallocated planned income</p>
                    <p>{currencyFormat(unallocatedFunds)}</p>
                </div>
                <div className="mt-2 w-full flex items-end">
                    <div className="w-full">
                        <Label htmlFor="amount">Allocate amount</Label>
                        <Input type="number" name="amount" value={maxAmount != null ? getMaxAmount() : ""} onChange={e => setMaxAmount(Number(e.target.value))} />
                        {validator.current.message("amount", maxAmount, "numeric|required")}
                    </div>
                    <div className="ml-2 max-w-32">
                        <Button onClick={() => setMaxAmount(previousMonthPlannedAmount)}>Use last month <br /> {currencyFormat(previousMonthPlannedAmount)}</Button>
                    </div>
                </div>

                <div className="w-full">
                    <Label htmlFor="amount">Notes</Label>
                    <Textarea name="notes" value={note} onChange={e => setNote(e.target.value)} />
                </div>
            </DrawerBody>
            <DrawerFooter className="w-full">
                <div className="flex w-full grow justify-end gap-2">
                    <Button className="rounded-md p-1 self-end min-w-16" variant="destructive" onClick={handleDeleteClick}>Delete Category</Button>
                    <Button className="rounded-md p-1 self-end min-w-16" onClick={handleSubmitClick}>Save Changes</Button>
                </div>
            </DrawerFooter>
        </div>
    )
}