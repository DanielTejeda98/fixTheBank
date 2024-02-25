import SimpleReactValidator from "simple-react-validator";
import { useState, useRef, useReducer, FormEvent } from "react";
import { requestToJoinBudget } from "@/app/lib/budgetApi";
import { useSession } from "next-auth/react";

export default function JoinBudget ({closeDrawer} : {closeDrawer: Function}) {
    const userId = useSession().data?.user?.id;
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const validator = useRef(new SimpleReactValidator());
    const [joinCode, setJoinCode] = useState("")

    const clearForm = () => {
        setJoinCode("");
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
            const res = await requestToJoinBudget({userId}, joinCode);
            if (!res.success) {
                console.error(res.error);
            } else {
                console.log("Request to join sent!")
            }
        } catch (error) {
            // TODO: display error
            console.error(error)
        }
        closeDrawer();
        clearForm();
    }

    return (
        <form onSubmit={formSubmit} onReset={clearForm}>
            <div className="mt-2">
                <label htmlFor="join-code">Join Code</label>
                <input type="text" name="join-code" className="ml-2 bg-slate-700" minLength={4} maxLength={4} value={joinCode} onChange={e => setJoinCode(e.target.value)}/>
                {validator.current.message("Join Code", joinCode, "alpha_num|min:4|max:4|required")}
            </div>

            <div className="flex justify-end gap-3 w-full mt-5">
                <button type="submit" className="bg-slate-500 rounded-md p-1">Request to join</button>
                <button type="reset" className="bg-red-700 rounded-md p-1">Clear</button>
            </div>
        </form>
    )
}