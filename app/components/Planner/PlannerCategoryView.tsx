import useReactValidator from "@/app/hooks/useReactValidator";
import { deleteCategory, updateCategoryWithMaxAmount } from "@/app/lib/categoriesApi";
import { useAppSelector } from "@/redux/store";
import { CategoryView } from "@/types/budget"
import { useSession } from "next-auth/react";
import { useReducer, useState } from "react";

export default function PlannerCategoryView ({category, closeDrawer}: {category?: CategoryView, closeDrawer: Function}) {
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const currentMonth = useAppSelector((state) => state.budgetReducer.value.minDate);

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
            <div className="mt-2 w-full">
                <label htmlFor="amount">Amount $</label>
                <input type="number" name="amount" className="ml-2 bg-slate-700" value={maxAmount} onChange={e => setMaxAmount(Number(e.target.value))} />
                {validator.current.message("amount", maxAmount, "numeric|required")}
            </div>
            <div className="flex w-full grow justify-end gap-2">
                <button className="bg-red-500 rounded-md p-1 self-end" onClick={handleDeleteClick}>Delete Category</button>
                <button className="bg-slate-500 rounded-md p-1 self-end" onClick={handleSubmitClick}>Save Changes</button>
            </div>
        </div>
    )
}