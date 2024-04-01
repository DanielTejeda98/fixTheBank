import useReactValidator from "@/app/hooks/useReactValidator";
import { createPlannedIncome } from "@/app/lib/budgetApi";
import { useAppSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import { FormEvent, useReducer } from "react";

type FormData = {
    source?: string,
    amount?: Number
}

export default function PlannerIncomeEditor ({closeDrawer}: {closeDrawer: Function}) {
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const currentMonth = useAppSelector((state) => state.budgetReducer.value.minDate);

    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        amount: 0,
        source: ""
    })

    const clearForm = () => {
        formDispatch({
            amount: 0,
            source: ""
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
            await createPlannedIncome({userId}, currentMonth, {...formData});
        } catch (error) {
            // TODO: display error
            console.log(error)
        }
        
        closeDrawer();
        clearForm();
    }

    return (
        <form className="flex flex-col min-h-60" onSubmit={formSubmit} onReset={clearForm}>
            <h2>Add Planned Income</h2>
            <div className="mt-2 w-full">
                <label htmlFor="amount">Source</label>
                <input type="text" name="source" className="ml-2 bg-slate-700" value={formData.source} onChange={e => formDispatch({ source: e.target.value })} />
                {validator.current.message("source", formData.source, "alpha_num_dash_space|required")}
            </div>
            <div className="mt-2 w-full">
                <label htmlFor="amount">Amount $</label>
                <input type="number" name="amount" className="ml-2 bg-slate-700" value={formData.amount?.toString()} onChange={e => formDispatch({ amount: Number(e.target.value) })} />
                {validator.current.message("amount", formData.amount, "numeric|required")}
            </div>
            <div className="flex w-full grow justify-end gap-2">
                <button className="bg-red-500 rounded-md p-1 self-end" type="reset">Reset</button>
                <button className="bg-slate-500 rounded-md p-1 self-end" type="submit">Save</button>
            </div>
        </form>
    )
}