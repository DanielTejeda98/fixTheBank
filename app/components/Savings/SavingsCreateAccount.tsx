import useReactValidator from "@/app/hooks/useReactValidator";
import { FormEvent, useReducer } from "react"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createSavingsAccount } from "@/app/lib/savingsApi";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import SavingsManageAccounts from "./SavingsManageAccounts";

interface FormData {
    name?: string,
}

export default function SavingsCreateAccount () {
    const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();
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
        setDrawerOpen(false);
        clearForm();
    }
    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap overflow-scroll">
            <DrawerHeader className="flex flex-row w-full items-center justify-between">
                <DrawerTitle>Create Savings Account</DrawerTitle>
                <Button type="button" variant={"link"} onClick={() => setDrawerComponent(<SavingsManageAccounts />)}>Back</Button>
            </DrawerHeader>
            <DrawerBody className="flex flex-col">
                <div className="mt-2 w-full">
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" name="name" value={formData.name} onChange={e => formDispatch({name: e.target.value})}/>
                    {validator.current.message("name", formData.name, "required")}
                </div>
            </DrawerBody>
            <DrawerFooter className="flex flex-row justify-end gap-3 w-full">
                <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-16">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-16">Create Savings Account</Button>
            </DrawerFooter>
        </form>
    )
}