import useReactValidator from "@/app/hooks/useReactValidator";
import { FormEvent, useReducer } from "react"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createSavingsBucket } from "@/app/lib/savingsApi";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useAppSelector } from "@/redux/store";
import SavingsAccountView from "./SavingsAccountView";

interface FormData {
    name?: string,
    goal?: number,
    goalBy?: string
}

export default function SavingsCreateAccountBucket ({savingsAccountId}: {savingsAccountId: string}) {
    const { setOpen: setDrawerOpen, setDrawerComponent } = useFTBDrawer();
    const account = useAppSelector((state) => state.savingsReducer.value.savingsAccounts.find(ac => ac._id === savingsAccountId))
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        name: "",
        goal: undefined,
        goalBy: ""
    })

    const clearForm = () => {
        formDispatch({
            name: "",
            goal: undefined,
            goalBy: ""
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
        
        await createSavingsBucket(savingsAccountId, {
            name: formData.name!,
            goal: formData.goal!,
            goalBy: formData.goalBy!
        })
        
        setDrawerOpen(false);
        clearForm();
    }

    const returnToAccount = () => {
        if (account) setDrawerComponent(<SavingsAccountView account={account} />);
    }

    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap overflow-scroll">
            <DrawerHeader className="flex flex-row w-full items-center justify-between">
                <DrawerTitle>Create New Bucket</DrawerTitle>
                <Button type="button" variant={"link"} onClick={() => returnToAccount()}>Back</Button>
            </DrawerHeader>
            <DrawerBody className="flex flex-col w-full">
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
                        <Input type="date" name="date" value={formData.goalBy} onChange={e => formDispatch({goalBy: e.target.value})}/>
                    </div>
                </div>
            </DrawerBody>

            <DrawerFooter className="flex flex-row justify-end gap-3 w-full">
                <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-16">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-16">Create Bucket</Button>
            </DrawerFooter>
        </form>
    )
}