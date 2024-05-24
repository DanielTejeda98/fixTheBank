import useReactValidator from "@/app/hooks/useReactValidator";
import { FormEvent, useReducer } from "react"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface FormData {
    savingsAccountId?: string,
    name?: string,
    goal?: number,
    achieveBy?: string
}

export default function SavingsCreateAccountBucket ({savingsAccountId, closeDrawer}: {savingsAccountId: string, closeDrawer: () => void}) {
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        savingsAccountId: savingsAccountId,
        name: "",
        goal: undefined,
        achieveBy: ""
    })

    const clearForm = () => {
        formDispatch({
            name: "",
            goal: undefined,
            achieveBy: ""
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
        
        // Todo API call
        
        closeDrawer();
        clearForm();
    }
    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap">
            <h2 className="text-lg font-bold w-full">
                Create New Bucket
            </h2>
            <div className="mt-2 w-full">
                <Label htmlFor="name">Bucket Name</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={e => formDispatch({name: e.target.value})}/>
                {validator.current.message("name", formData.name, "required")}
            </div>

            <div className="mt-2 w-full">
                <Label htmlFor="income">Goal</Label>
                <Input type="number" id="income" name="income" value={formData.goal} onChange={e => formDispatch({goal: Number(e.target.value)})}/>
                {validator.current.message("income", formData.goal, "numeric|required")}
            </div>

            <div className="mt-2 w-full flex flex-wrap">
                <Label htmlFor="date" className="w-full">Achieve Goal By</Label>
                <div className="flex w-full gap-2 mt-1">
                    <Input type="date" name="date" value={formData.achieveBy} onChange={e => formDispatch({achieveBy: e.target.value})}/>
                </div>
            </div>

            <div className="flex justify-end gap-3 w-full mt-5">
                <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-32">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-32">Create Bucket</Button>
            </div>
        </form>
    )
}