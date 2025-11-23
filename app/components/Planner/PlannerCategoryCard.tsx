import { currencyFormat } from "@/app/lib/renderHelper"
import { useAppSelector } from "@/redux/store"
import { CategoryView } from "@/types/budget"
import { useFTBDrawer } from "../ui/ftbDrawer"
import PlannerCategoryView from "./PlannerCategoryView"

type PlannerCategoriesCard = {
    category: CategoryView,
    onClick?: Function
}
export default function PlannerCategoriesCard ({category, onClick}: PlannerCategoriesCard) {
    const { setOpen, setDrawerComponent } = useFTBDrawer();
    const currentMonth = useAppSelector(state => state.budgetReducer.value.minDate)
    const maxAmount = category.maxMonthExpectedAmount.find((c:any) => c.month === currentMonth)?.amount || 0
    const usedAmount = useAppSelector(state => state.budgetReducer.value.expenses).reduce((acc: number, current: any) => {
        if(current.category !== category._id) {
            return acc;
        }

        if (current.borrowFromNextMonth && new Date(current.date).getMonth() != new Date(currentMonth).getMonth()) {
            return acc;
        }
        return acc + current.amount;
    }, 0)

    const percentageUsage = usedAmount < maxAmount ? (usedAmount / maxAmount) * 100 : 100;
    const isOverdrafted = usedAmount > maxAmount;

    function handleClick () {
        setDrawerComponent(<PlannerCategoryView key={category?._id} category={category} />);
        setOpen(true);
    }

    return (
        <li className="flex flex-wrap items-center mb-2 p-2 gap-2 rounded-md border"
            onClick={() => handleClick() }>
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
            <div className="rounded-full bg-white w-full mb-5 h-1">
                <div className="h-1 bg-purple-800" style={{width: `${percentageUsage}%`}}></div>
            </div>
        </li>
    )
}