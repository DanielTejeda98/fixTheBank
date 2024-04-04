import { currencyFormat } from "@/app/lib/renderHelper"
import { useAppSelector } from "@/redux/store"
import { CategoryView } from "@/types/budget"

type PlannerCategoriesCard = {
    category: CategoryView,
    onClick?: Function
}
export default function PlannerCategoriesCard ({category, onClick}: PlannerCategoriesCard) {
    const currentMonth = useAppSelector(state => state.budgetReducer.value.minDate)
    const maxAmount = category.maxMonthExpectedAmount.find((c:any) => c.month === currentMonth)?.amount || 0
    const usedAmount = useAppSelector(state => state.budgetReducer.value.expenses).reduce((acc: Number, current: any) => {
        if(current.category !== category._id) {
            return acc;
        }
        return acc + current.amount;
    }, 0)

    const percentageUsage = usedAmount < maxAmount ? (usedAmount / maxAmount) * 100 : 100;
    const isOverdrafted = usedAmount > maxAmount;
    return (
        <li className="flex flex-wrap items-center mb-2 p-2 bg-slate-800 gap-2 rounded-md"
            onClick={() => { onClick && onClick(category) } }>
            <div className="w-full">
                {category.name}
            </div>
            <div className="flex justify-between w-full">
                <div className="text-sm">
                    <p className={`${isOverdrafted ? "text-red-500" : null}`}>{currencyFormat(usedAmount)}</p>
                </div>
                <div className="text-sm text-end">
                    <p>Allotted amount: {currencyFormat(maxAmount)}</p>
                    <p>Remaining amount: {currencyFormat(maxAmount - usedAmount)}</p>
                </div>
            </div>
            <div className="rounded-full w-full mb-5 h-1 bg-gray-200">
                <div className="h-1 bg-purple-500" style={{width: `${percentageUsage}%`}}></div>
            </div>
        </li>
    )
}