import useReactValidator from "@/app/hooks/useReactValidator";
import { currencyFormat } from "@/app/lib/renderHelper";
import { selectUnallocatedFunds } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useReducer, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface FormData {
    amount: number,
    source: string
}

export default function PlannerSavingsEditor ({closeDrawer}: {closeDrawer: Function}) {
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const currentMonth = useAppSelector((state) => state.budgetReducer.value.minDate);
    const unallocatedFunds = useAppSelector((state) => selectUnallocatedFunds(state));
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

    const handleSubmitClick = async () => {
        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }
        try {
            
        } catch (error) {
            console.log(error)
        }
        clearForm();
        closeDrawer();
    }

    const handleDeleteClick = async () => {
        try {
            
        } catch (error) {
            console.log(error)
        }
        closeDrawer()
    }

    return (
        <form className="flex flex-col min-h-60" onSubmit={handleSubmitClick} onReset={clearForm}>
            <h2 className="w-full">Create Savings Plan</h2>
            <div className="mt-2 p-2 w-full border rounded-md border-slate-500">
                <p>Remaining unallocated planned income</p>
                <p>{currencyFormat(unallocatedFunds)}</p>
            </div>
            <div className="mt-2 w-full">
                <Label htmlFor="amount">Planned Month Savings Amount</Label>
                <Input type="number" name="amount" value={formData.amount} onChange={e => formDispatch({...formData, amount: Number(e.target.value)})} />
                {validator.current.message("amount", formData.amount, "numeric|required")}
            </div>
            <div className="flex w-full grow justify-end gap-2">
                <Button className="rounded-md p-1 self-end min-w-32" variant="destructive" type="reset">Reset</Button>
                <Button className="rounded-md p-1 self-end min-w-32" type="submit">Save Changes</Button>
            </div>
        </form>
    )
}