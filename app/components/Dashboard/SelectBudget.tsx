import { getBudget, toggleBudgetShareSettings } from "@/app/lib/budgetApi";
import { setBudget } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { FormEvent, useReducer, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import ToggleSlider from "../ToggleSlider";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { formatDateInput } from "@/app/lib/renderHelper";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useFTBDrawer } from "../ui/ftbDrawer";

export default function SelectBudget () {
    const { setOpen: setOpenDrawer } = useFTBDrawer();
    const userId = useSession().data?.user.id;
    const validator = useRef(new SimpleReactValidator());
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const reduxDispatch = useDispatch();
    const date = useAppSelector((state) => state.budgetReducer.value.minDate);
    const isShared = useAppSelector((state) => state.budgetReducer.value.isShared);
    const shareCode = useAppSelector((state) => state.budgetReducer.value.shareCode);
    const isOwner = useAppSelector((state) => state.budgetReducer.value.isOwner);

    const [budgetDate, setBudgetDate] = useState(date)
    const [isBudgetShared, setIsBudgetShared] = useState(isShared);

    const submitBudgetUpdates = async (form: FormEvent) => {
        form.preventDefault();

        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }

        try {
            await processBudgetShareUpdates({userId});

            const res = await getBudget({userId}, budgetDate)
            if (res.success) {
                sessionStorage.setItem("selectedBudgetDate", budgetDate);
                document.cookie = `selectedBudgetDate=${budgetDate}`;
                // Set store values
                reduxDispatch(setBudget(res.data));
            }
        } catch (error) {
            // TODO: display error
            console.log(error)
        }

        setOpenDrawer(false);
    }

    const processBudgetShareUpdates = async (headers: any) => {
        if (isShared === isBudgetShared) {
            return;
        }

        try {
            const res = await toggleBudgetShareSettings(headers);
            if (!res.success) {
                console.log(res.error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const renderShareOptions = () => {
        if (!isOwner) {
            return null
        }
        return (
            <div className="mt-3">
            <ToggleSlider name="sharedBudget" 
                          id="is-shared-budget"
                          label="Share budget?"
                          state={isBudgetShared} 
                          onChange={(value:boolean) => setIsBudgetShared(value)}/>
            {isBudgetShared ? (<p>Share this code with family and friends so they can join: {shareCode}</p>) : null}
            </div>
        )
    }

    return (
    <form className="flex flex-col w-full overflow-scroll" onSubmit={submitBudgetUpdates}>
        <DrawerHeader>
            <DrawerTitle>Select the budget month</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="flex flex-col">
            <div className="w-full">
                <Label htmlFor="date">Budget Date</Label>
                <div className="flex w-full gap-2">
                    <Input type="date" name="date" value={budgetDate} onChange={e => setBudgetDate(e.target.value)}/>
                    <Button type="button" onClick={e => setBudgetDate(formatDateInput(new Date()))}>Today</Button>
                </div>
                { validator.current.message("date", budgetDate, "required") }
            </div>
            {renderShareOptions()}
        </DrawerBody>
        
        <DrawerFooter className="w-full">
            <div className="flex grow items-end justify-end gap-3 w-full mt-5">
                <Button type="reset" variant="destructive" className="rounded-md p-1 min-w-32">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-32">Confirm</Button>
            </div>
        </DrawerFooter>
    </form>
    );
}