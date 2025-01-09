import useReactValidator from "@/app/hooks/useReactValidator";
import { FormEvent, useReducer } from "react"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createSavingsAccount } from "@/app/lib/savingsApi";

interface FormData {
    name?: string,
}

export default function SavingsCreateAccount ({closeDrawer}: {closeDrawer: () => void}) {
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        name: ""
    })

    const clearForm = () => {
        formDispatch({
            name: ""
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
        
        await createSavingsAccount({ name: formData.name || "" });
        closeDrawer();
        clearForm();
    }
    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap">
            <h2 className="text-lg font-bold w-full">
                Create Savings Account
            </h2>
            <div className="mt-2 w-full">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" value={formData.name} onChange={e => formDispatch({name: e.target.value})}/>
                {validator.current.message("name", formData.name, "required")}
            </div>

            <div className="flex justify-end gap-3 w-full mt-5">
                <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-32">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-32">Create Savings Account</Button>
            </div>
        </form>
    )
}