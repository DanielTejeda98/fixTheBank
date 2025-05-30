import useReactValidator from "@/app/hooks/useReactValidator";
import { createPlannedIncome } from "@/app/lib/budgetApi";
import { useAppSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import { FormEvent, useReducer } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

type FormData = {
    source?: string,
    amount?: number
}

export default function PlannerIncomeEditor () {
    const { setOpen: setDrawerOpen } = useFTBDrawer();
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const currentMonth = useAppSelector((state) => state.budgetReducer.value.minDate);

    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        amount: undefined,
        source: ""
    })

    const clearForm = () => {
        formDispatch({
            amount: undefined,
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
        
        setDrawerOpen(false);
        clearForm();
    }

    return (
        <form className="flex flex-col min-h-60" onSubmit={formSubmit} onReset={clearForm}>
            <DrawerHeader>
                <DrawerTitle>Add Planned Income</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col w-full">
                <div className="mt-2 w-full">
                    <Label htmlFor="amount">Source</Label>
                    <Input type="text" name="source" value={formData.source} onChange={e => formDispatch({ source: e.target.value })} />
                    {validator.current.message("source", formData.source, "alpha_num_dash_space|required")}
                </div>
                <div className="mt-2 w-full">
                    <Label htmlFor="amount">Amount</Label>
                    <Input type="number" name="amount" value={formData.amount || ""} onChange={e => formDispatch({ amount: Number(e.target.value) })} />
                    {validator.current.message("amount", formData.amount, "numeric|required")}
                </div>
            </DrawerBody>
            <DrawerFooter className="w-full">
                <div className="flex w-full grow justify-end gap-2">
                    <Button variant="destructive" className="rounded-md p-1 self-end min-w-16" type="reset">Reset</Button>
                    <Button className="rounded-md p-1 self-end min-w-16" type="submit">Save</Button>
                </div>
            </DrawerFooter>
        </form>
    )
}