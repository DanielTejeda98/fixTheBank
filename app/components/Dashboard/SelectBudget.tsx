import { getBudget } from "@/app/lib/budgetApi";
import { getUserFromCookie } from "@/app/lib/utilClientHelpers";
import { setBudget } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { FormEvent, useReducer, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SimpleReactValidator from "simple-react-validator";

export default function SelectBudget ({closeDrawer}: {closeDrawer: Function}) {
    const validator = useRef(new SimpleReactValidator());
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const reduxDispatch = useDispatch();
    const date = useAppSelector((state) => state.budgetReducer.value.minDate)

    const [budgetDate, setBudgetDate] = useState(date)

    const submitBudgetDateChange = async (form: FormEvent) => {
        form.preventDefault();

        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }

        const headers = {
            userId: getUserFromCookie()?._id
        }
        try {
            const res = await getBudget(headers, new Date(budgetDate))
            if (res.sucess) {
                sessionStorage.setItem("selectedBudgetDate", budgetDate);
                // Set store values
                reduxDispatch(setBudget(res.data));
            }
        } catch (error) {
            // TODO: display error
            console.log(error)
        }

        closeDrawer();
    }

    return (
    <form className="flex flex-wrap" onSubmit={submitBudgetDateChange}>
        <label className="text-sm">Set the date for the budget you would like to see</label>
        <input type="date" className="ml-2 bg-slate-700" pattern="\d{1,2}\/d{4}" value={budgetDate} onChange={e => setBudgetDate(e.target.value)}/>
        { validator.current.message("date", budgetDate, "required") }
        <div className="flex justify-end gap-3 w-full mt-5">
                <button type="submit" className="bg-slate-500 rounded-md p-1">Confirm</button>
                <button type="reset" className="bg-red-700 rounded-md p-1">Clear</button>
            </div>
    </form>
    );
}