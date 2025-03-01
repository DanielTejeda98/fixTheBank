import SimpleReactValidator from "simple-react-validator";
import { useState, useRef, useReducer, FormEvent } from "react";
import { requestToJoinBudget } from "@/app/lib/budgetApi";
import { useSession } from "next-auth/react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useFTBDrawer } from "../ui/ftbDrawer";

export default function JoinBudget () {
    const userId = useSession().data?.user?.id;
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const validator = useRef(new SimpleReactValidator());
    const [joinCode, setJoinCode] = useState("")
    const { setOpen: setDrawerOpen } = useFTBDrawer();

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
        setDrawerOpen(false);
        clearForm();
    }

    return (
        <form onSubmit={formSubmit} onReset={clearForm}>
            <DrawerHeader>
                <DrawerTitle>Join a budget</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col">
                <div className="mt-2">
                    <Label htmlFor="join-code">Join Code</Label>
                    <Input type="text" name="join-code" className="ml-2" minLength={4} maxLength={4} value={joinCode} onChange={e => setJoinCode(e.target.value)}/>
                    {validator.current.message("Join Code", joinCode, "alpha_num|min:4|max:4|required")}
                </div>
            </DrawerBody>

            <DrawerFooter className="w-full">
                <div className="flex justify-end gap-3 w-full mt-5">
                    <Button type="reset" variant="destructive" className="rounded-md p-1 min-w-32">Clear</Button>
                    <Button type="submit" className="rounded-md p-1 min-w-32">Request to join</Button>
                </div>
            </DrawerFooter>
        </form>
    )
}