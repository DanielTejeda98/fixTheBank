import { getBudget, toggleBudgetShareSettings } from "@/app/lib/budgetApi";
import { setBudget } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { FormEvent, useReducer, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import ToggleSlider from "../ToggleSlider";
import { useSession } from "next-auth/react";

export default function SelectBudget ({closeDrawer}: {closeDrawer: Function}) {
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

            const res = await getBudget({userId}, new Date(budgetDate))
            if (res.success) {
                sessionStorage.setItem("selectedBudgetDate", budgetDate);
                // Set store values
                reduxDispatch(setBudget(res.data));
            }
        } catch (error) {
            // TODO: display error
            console.log(error)
        }

        closeDrawer();
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
    <form className="flex flex-wrap" onSubmit={submitBudgetUpdates}>
        <div>
            <label className="text-sm">Set the date for the budget you would like to see</label>
            <input type="date" className="ml-2 bg-slate-700" pattern="\d{1,2}\/d{4}" value={budgetDate} onChange={e => setBudgetDate(e.target.value)}/>
            { validator.current.message("date", budgetDate, "required") }
        </div>
        
        {renderShareOptions()}

        <div className="flex justify-end gap-3 w-full mt-5">
            <button type="submit" className="bg-slate-500 rounded-md p-1">Confirm</button>
            <button type="reset" className="bg-red-700 rounded-md p-1">Clear</button>
        </div>
    </form>
    );
}