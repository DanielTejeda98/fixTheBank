import { createIncome, getBudget } from "@/app/lib/budgetApi";
import { FormEvent, useReducer, useRef } from "react";
import SimpleReactValidator from "simple-react-validator";
import { setBudget } from "@/redux/features/budget-slice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";

interface FormData {
    budgetId?: string,
    amount?: number,
    source?: string,
    date?: string
}

export default function AddIncome ({closeDrawer, budgetId}: {closeDrawer: Function, budgetId: string}) {
    const userId = useSession().data?.user?.id;
    const reduxDispatch = useDispatch();
    const validator = useRef(new SimpleReactValidator());
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        amount: 0,
        source: "",
        date: ""
    })

    const clearForm = () => {
        formDispatch({
            amount: 0,
            source: "",
            date: ""
        })
        validator.current.hideMessages();
    }

    const formSubmit = async (form: FormEvent) => {
        form.preventDefault();

        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }
        
        try {
            await createIncome({userId}, {...formData, budgetId});
            const res = await getBudget({userId})
            // Set store values
            reduxDispatch(setBudget(res.data));
        } catch (error) {
            // TODO: display error
            console.log(error)
        }
        
        closeDrawer();
        clearForm();
    }
    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap">
            <h2 className="text-lg font-bold w-full">Add Income</h2>
            <p className="text-sm w-full">Add income for this month</p>
            <div className="mt-2">
                <label htmlFor="income">Income</label>
                <input type="number" id="income" name="income" className="ml-2 bg-slate-700" value={formData.amount} onChange={e => formDispatch({amount: Number(e.target.value)})}/>
                {validator.current.message("income", formData.amount, "numeric|required")}
            </div>

            <div className="mt-2">
                <label htmlFor="source">Source</label>
                <input type="text" id="source" name="source" className="ml-2 bg-slate-700" value={formData.source} onChange={e => formDispatch({source: e.target.value})}/>
                {validator.current.message("source", formData.source, "alpha_num_dash_space|required")}
            </div>

            <div className="mt-2">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" className="ml-2 bg-slate-700" value={formData.date} onChange={e => formDispatch({date: e.target.value})}/>
                {validator.current.message("date", formData.date, "alpha_num_dash_space|required")}
            </div>
            
            <div className="flex justify-end gap-3 w-full mt-5">
                <button type="submit" className="bg-slate-500 rounded-md p-1">Add Income</button>
                <button type="reset" className="bg-red-700 rounded-md p-1">Clear</button>
            </div>
        </form>
    )
}