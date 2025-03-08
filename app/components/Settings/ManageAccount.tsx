import { FormEvent, useReducer, useState } from "react";
import { useSession } from "next-auth/react";
import useReactValidator from "@/app/hooks/useReactValidator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DrawerBody, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { createAccount, deleteAccount, updateAccount } from "@/app/lib/accountApi";
import { AccountView } from "@/types/budget";

export default function ManageAccount ({account}: {account?: AccountView}) {
    const { setOpen } = useFTBDrawer();
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const [accountName, setAccountName] = useState(account?.name || "")
    const editing = !!account;
    const prefix = editing ? "Edit" : "Create";

    const clearForm = () => {
        setAccountName("")
        validator.current.hideMessages();
    }

    const formSubmit = async (form: FormEvent) => {
        form.preventDefault();

        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }
        
        if (editing) {
            await updateAccount({userId}, account._id, {name: accountName});
        } else {
            await createAccount({userId}, {name: accountName});
        }
        
        setOpen(false);
        clearForm();
    }

    const deleteAccountClick = async () => {
        if (editing) await deleteAccount({userId}, account?._id)
        setOpen(false);
    }
    return (
        <>
            <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap overflow-scroll">
                <DrawerHeader>
                    <DrawerTitle>{prefix} account</DrawerTitle>
                    <DrawerDescription>Use this form to {prefix.toLowerCase()} an account</DrawerDescription>
                </DrawerHeader>
                <DrawerBody className="flex-col w-full">
                    <div className="mt-2 w-full">
                        <Label htmlFor="name">Account name</Label>
                        <Input type="text" id="name" name="name" value={accountName || ""} onChange={e => setAccountName(e.target.value)}/>
                        {validator.current.message("name", accountName, "required")}
                    </div>
                </DrawerBody>
                
                <DrawerFooter className="w-full">
                    <div className="flex justify-between w-full mt-5">
                        {editing && <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-16" onClick={deleteAccountClick}>Delete</Button>}
                        <div className="flex gap-3 w-full justify-end">
                            {!editing && <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-16">Clear</Button>}
                            <Button type="submit" className="rounded-md p-1 min-w-16">
                                {editing ? "Save changes" : "Create account"}
                            </Button>
                        </div>
                    </div>
                </DrawerFooter>
            </form>
        </>
    )
}