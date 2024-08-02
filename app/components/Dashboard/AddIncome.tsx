import { createIncome, getBudget } from "@/app/lib/budgetApi";
import { FormEvent, useReducer } from "react";
import { setBudget } from "@/redux/features/budget-slice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import useReactValidator from "@/app/hooks/useReactValidator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { formatDateInput } from "@/app/lib/renderHelper";
import { useAppSelector } from "@/redux/store";

interface FormData {
    budgetId?: string,
    amount?: number,
    source?: string,
    date?: string
}

export default function AddIncome ({closeDrawer, budgetId}: {closeDrawer: Function, budgetId: string}) {
    const userId = useSession().data?.user?.id;
    const reduxDispatch = useDispatch();
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const dateButtonOnLeft = useAppSelector((state) => state.settingsReducer.value.dateTodayButtonOnLeft);
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        amount: undefined,
        source: "",
        date: ""
    })

    const clearForm = () => {
        formDispatch({
            amount: undefined,
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
            const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
            const res = await getBudget({ userId }, budgetDate)
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
            <div className="mt-2 w-full">
                <Label htmlFor="income">Income</Label>
                <Input type="number" id="income" name="income" value={formData.amount || ""} onChange={e => formDispatch({amount: Number(e.target.value)})}/>
                {validator.current.message("income", formData.amount, "numeric|required")}
            </div>

            <div className="mt-2 w-full">
                <Label htmlFor="source">Source</Label>
                <Input type="text" id="source" name="source" value={formData.source} onChange={e => formDispatch({source: e.target.value})}/>
                {validator.current.message("source", formData.source, "required")}
            </div>

            <div className="mt-2 w-full flex flex-wrap">
                <Label htmlFor="date" className="w-full">Date</Label>
                <div className="flex w-full gap-2 mt-1">
                    { dateButtonOnLeft ? <Button type="button" onClick={e => formDispatch({date: formatDateInput(new Date())})}>Today</Button> : null}
                    <Input type="date" name="date" value={formData.date} onChange={e => formDispatch({date: e.target.value})}/>
                    { !dateButtonOnLeft ? <Button type="button" onClick={e => formDispatch({date: formatDateInput(new Date())})}>Today</Button> : null}
                </div>
                {validator.current.message("date", formData.date, "required")}
            </div>
            
            <div className="flex justify-end gap-3 w-full mt-5">
                <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-32">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-32">Add Income</Button>
            </div>
        </form>
    )
}