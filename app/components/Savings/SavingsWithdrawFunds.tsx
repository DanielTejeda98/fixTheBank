import { FormEvent, useReducer } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useReactValidator from "@/app/hooks/useReactValidator";
import { useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { formatDateInput } from "@/app/lib/renderHelper";
import { createTransaction } from "@/app/lib/savingsApi";
import { SavingsAccount } from "@/types/savings";

interface FormData {
    name?: string;
    amount?: number;
    date?: string;
}

export default function SavingsWithdrawFunds ({account, closeDrawer}: {account:SavingsAccount, closeDrawer: () => void}) {
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const dateButtonOnLeft = useAppSelector((state) => state.settingsReducer.value.dateTodayButtonOnLeft);
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        name: "",
        amount: undefined,
        date: ""
    })

    const clearForm = () => {
        formDispatch({
            name: "",
            amount: undefined,
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
        
        await createTransaction({
            transactionType: "withdraw",
            amount: formData.amount!,
            date: formData.date!,
            accountId: account._id,
            name: formData.name!.trim()
        })
        
        closeDrawer();
        clearForm();
    }
    
    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap">
            <h2 className="text-lg font-bold w-full">
                Withdraw Funds
            </h2>

            <div className="mt-2 w-full">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={e => formDispatch({name: e.target.value})}/>
                {validator.current.message("name", formData.name, "required")}
            </div>
            
            <div className="mt-2 w-full">
                <Label htmlFor="amount">Amount</Label>
                <Input type="number" id="amount" name="amount" value={formData.amount} onChange={e => formDispatch({amount: Number(e.target.value)})}/>
                {validator.current.message("amount", formData.amount, "numeric|required")}
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
                <Button type="submit" className="rounded-md p-1 min-w-32">Withdraw Funds</Button>
            </div>
        </form>
    )
}