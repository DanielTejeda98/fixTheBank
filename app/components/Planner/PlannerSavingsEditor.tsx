import useReactValidator from "@/app/hooks/useReactValidator";
import { currencyFormat, formatCurrencyInput } from "@/app/lib/renderHelper";
import { selectUnallocatedFunds } from "@/redux/features/budget-slice";
import { useAppSelector } from "@/redux/store";
import { FormEvent, ReactNode, useEffect, useReducer } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { addSavingsPlan, deleteSavingsPlan, editSavingsPlan } from "@/app/lib/savingsApi";
import { PlannedSaving } from "@/types/savings";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface FormData {
    amount: string,
    account: string,
    bucket: string,
    description: string,
}

const getIntitalFormData = (savings?: PlannedSaving) => {
    if (savings) {
        return {
            amount: savings.amount.toString(),
            account: savings.account.toString(),
            bucket: savings.bucket.toString(),
            description: savings.description || ""
        }
    }

    return {
        amount: "",
        account: "",
        bucket: "",
        description: ""
    }
}

export default function PlannerSavingsEditor ({savingsTransaction}: {savingsTransaction?: PlannedSaving}) {
    const validator = useReactValidator();
    const { setOpen: setDrawerOpen } = useFTBDrawer();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const savingsAccounts = useAppSelector((state) => state.savingsReducer.value.savingsAccounts);
    const unallocatedFunds = useAppSelector((state) => selectUnallocatedFunds(state));
    const budgetMonth = useAppSelector((state) => state.budgetReducer.value.minDate)

    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {...getIntitalFormData(savingsTransaction)})

    // We purposely do not want to watch formData here as it will cause an infinate loop
    useEffect(() => {
        const dispatch = formDispatch;
        dispatch({...formData, ...getIntitalFormData(savingsTransaction)});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savingsTransaction])

    const clearForm = () => {
        formDispatch({
            amount: "",
            account: "",
            bucket: "",
            description: ""
        })
        validator.current.hideMessages();
    }

    const handleSubmitClick = async (form: FormEvent) => {
        form.preventDefault();
        
        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }
        try {
            !savingsTransaction
                ? await addSavingsPlan({...formData, amount: Number(formData.amount)}, budgetMonth) 
                : await editSavingsPlan(savingsTransaction._id, {...formData, amount: Number(formData.amount)}, budgetMonth)

        } catch (error) {
            console.log(error)
        }
        !savingsTransaction && clearForm();
        setDrawerOpen(false);
    }

    const handleDeleteClick = async () => {
        try {
            await deleteSavingsPlan(savingsTransaction!!._id, budgetMonth)
        } catch (error) {
            console.log(error)
        }
        clearForm()
        setDrawerOpen(false)
    }

    const renderAccountOptions = (): ReactNode => {
        return savingsAccounts.map(account => (
            <SelectItem value={account._id} key={account._id}>{account.name}</SelectItem>
        ))
    }

    const renderBucketOptions = (): ReactNode => {
        if (!formData.account) {
            return null;
        }

        return savingsAccounts.find(sa => sa._id === formData.account)?.buckets.map(bkt => (
            <SelectItem value={bkt._id} key={bkt._id}>{bkt.name}</SelectItem>
        ))
    }

    const handleAmountUpdate = (amount: string) => {
        formDispatch({...formData, amount: formatCurrencyInput(amount)});
    }

    const handleAccountUpdate = (account: string) => {
        formDispatch({...formData, account: account, bucket: "" });
    }

    const handleBucketUpdate = (bucket: string) => {
        // This if statement takes care of a weird bug where this event was being triggered
        // and it would push stale formData to the reducer
        if (bucket === formData.bucket) {
            return;
        }
        formDispatch({...formData, bucket: bucket });
    }

    const handleDescriptionUpdate = (desc: string) => {
        formDispatch({...formData, description: desc});
    }

    return (
        <form className="flex flex-wrap" onSubmit={handleSubmitClick} onReset={clearForm}>
            <DrawerHeader>
                <DrawerTitle>Create Savings Plan</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col w-full">
                <div className="mt-2 p-2 w-full border rounded-md border-slate-500">
                    <p>Remaining unallocated planned income</p>
                    <p>{currencyFormat(unallocatedFunds)}</p>
                </div>
                <div className="mt-2 w-full">
                    <Label htmlFor="amount">Planned Month Savings Amount</Label>
                    <Input type="number" name="amount" value={formData.amount} onChange={e => handleAmountUpdate(e.target.value)} />
                    {validator.current.message("amount", formData.amount, "numeric|required")}
                </div>
                <div className="mt-2 w-full">
                    <Label htmlFor="account">To Account</Label>
                    <Select value={formData.account} onValueChange={(e: string) => handleAccountUpdate(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an account"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {renderAccountOptions()}
                        </SelectContent>
                    </Select>
                    {validator.current.message("account", formData.account, "required")}
                </div>
                <div className="mt-2 w-full">
                    <Label htmlFor="bucket">To Bucket</Label>
                    <Select value={formData.bucket} disabled={!formData.account} onValueChange={(e: string) => handleBucketUpdate(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a bucket"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {renderBucketOptions()}
                        </SelectContent>
                    </Select>
                    {validator.current.message("bucket", formData.bucket, "required")}
                </div>
                <div className="mt-2 w-full">
                    <Label htmlFor="description">Description</Label>
                    <Input type="text" name="description" value={formData.description} onChange={e => handleDescriptionUpdate(e.target.value)} />
                    {validator.current.message("amount", formData.amount, "required")}
                </div>
            </DrawerBody>
            <DrawerFooter className="w-full">
                <div className="flex w-full grow mt-5">
                    <div className="flex w-full grow justify-end gap-3">
                        {savingsTransaction ? <Button className="rounded-md p-1 min-w-16" variant="destructive" onClick={handleDeleteClick}>Delete</Button> : null}
                        <Button className="rounded-md p-1 self-end min-w-16" variant="destructive" type="reset">Reset</Button>
                        <Button className="rounded-md p-1 self-end min-w-16" type="submit">Save Changes</Button>
                    </div>
                </div>
            </DrawerFooter>
        </form>
    )
}