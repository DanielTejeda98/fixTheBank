import useReactValidator from "@/app/hooks/useReactValidator";
import { useAppSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useReducer } from "react";

export default function PlannerIncomeEditor () {
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const currentMonth = useAppSelector((state) => state.budgetReducer.value.minDate);

    return (
        <div className="flex flex-col min-h-60">
            <h2>Add Planned Income</h2>
            <div className="mt-2 w-full">
                <label htmlFor="amount">Amount $</label>
                <input type="number" name="amount" className="ml-2 bg-slate-700" value={""} onChange={e => console.log(e)} />
                {/* validator.current.message("amount", maxAmount, "numeric|required") */}
            </div>
            <div className="flex w-full grow justify-end gap-2">
                <button className="bg-slate-500 rounded-md p-1 self-end" onClick={() => {}}>Save</button>
            </div>
        </div>
    )
}