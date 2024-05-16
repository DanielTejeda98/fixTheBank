import useReactValidator from "@/app/hooks/useReactValidator";
import { deleteCategory, updateCategoryWithMaxAmount } from "@/app/lib/categoriesApi";
import { currencyFormat } from "@/app/lib/renderHelper";
import { selectUnallocatedFunds } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { CategoryView } from "@/types/budget"
import { useSession } from "next-auth/react";
import { useReducer, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function PlannerCategoryView ({category, closeDrawer}: {category?: CategoryView, closeDrawer: Function}) {
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const currentMonth = useAppSelector((state) => state.budgetReducer.value.minDate);
    const unallocatedFunds = useAppSelector((state) => selectUnallocatedFunds(state));

    const [maxAmount, setMaxAmount] = useState(category?.maxMonthExpectedAmount.find((c:any) => c.month === currentMonth)?.amount || 0)

    const handleSubmitClick = async () => {
        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }
        try {
            await updateCategoryWithMaxAmount({userId}, {
                _id: category?._id,
                name: category?.name,
                sortRank: 0,
                date: currentMonth,
                amount: maxAmount
            })
        } catch (error) {
            console.log(error)
        }
        closeDrawer();
    }

    const handleDeleteClick = async () => {
        try {
            if (!category) return;

            await deleteCategory({userId}, category?._id)
        } catch (error) {
            console.log(error)
        }
        closeDrawer()
    }

    if (!category) return;

    return (
        <div className="flex flex-col min-h-60">
            <h2 className="w-full">{category.name}</h2>
            <div className="mt-2 p-2 w-full border rounded-md border-slate-500">
                <p>Remaining unallocated planned income</p>
                <p>{currencyFormat(unallocatedFunds)}</p>
            </div>
            <div className="mt-2 w-full">
                <Label htmlFor="amount">Allocate amount</Label>
                <Input type="number" name="amount" value={maxAmount} onChange={e => setMaxAmount(Number(e.target.value))} />
                {validator.current.message("amount", maxAmount, "numeric|required")}
            </div>
            <div className="flex w-full grow justify-end gap-2">
                <Button className="rounded-md p-1 self-end min-w-32" variant="destructive" onClick={handleDeleteClick}>Delete Category</Button>
                <Button className="rounded-md p-1 self-end min-w-32" onClick={handleSubmitClick}>Save Changes</Button>
            </div>
        </div>
    )
}