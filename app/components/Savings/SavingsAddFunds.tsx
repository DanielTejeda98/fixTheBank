import { FormEvent, ReactNode, useReducer } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useReactValidator from "@/app/hooks/useReactValidator";
import { useAppSelector } from "@/redux/store";
import { Button } from "../ui/button";
import { formatCurrencyInput, formatDateInput } from "@/app/lib/renderHelper";
import { createTransaction } from "@/app/lib/savingsApi";
import { SavingsAccount } from "@/types/savings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useFTBDrawer } from "../ui/ftbDrawer";
import { DrawerBody, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

interface FormData {
    name?: string,
    amount?: string,
    date?: string,
    bucket?: string
}

export default function SavingsAddFunds ({account}: {account: SavingsAccount}) {
    const { setOpen: setDrawerOpen } = useFTBDrawer();
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const dateButtonOnLeft = useAppSelector((state) => state.settingsReducer.value.dateTodayButtonOnLeft);
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        name: "",
        amount: "",
        date: "",
        bucket: ""
    })

    const clearForm = () => {
        formDispatch({
            name: "",
            amount: "",
            date: "",
            bucket: ""
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
        
        await createTransaction({
            transactionType: "deposit",
            amount: Number(formData.amount!),
            date: formData.date!,
            accountId: account._id,
            name: formData.name!.trim(),
            bucket: formData.bucket!
        })
        
        setDrawerOpen(false);
        clearForm();
    }

    const handleBucketUpdate = (bucket: string) => {
        // This if statement takes care of a weird bug where this event was being triggered
        // and it would push stale formData to the reducer
        if (bucket === formData.bucket) {
            return;
        }
        formDispatch({...formData, bucket: bucket });
    }

    const renderBucketOptions = (): ReactNode => {
        return account.buckets.map(bkt => (
            <SelectItem value={bkt._id} key={bkt._id}>{bkt.name}</SelectItem>
        ))
    }
    
    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap overflow-scroll">
            <DrawerHeader>
                <DrawerTitle>Add Funds for &quot;{account.name}&quot;</DrawerTitle>
            </DrawerHeader>
            <DrawerBody className="flex flex-col w-full">
                <div className="mt-2 w-full">
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" name="name" value={formData.name} onChange={e => formDispatch({name: e.target.value})}/>
                    {validator.current.message("name", formData.name, "required")}
                </div>

                <div className="mt-2 w-full">
                    <Label htmlFor="income">Income</Label>
                    <Input type="number" id="income" name="income" value={formData.amount} onChange={e => formDispatch({amount: formatCurrencyInput(e.target.value)})}/>
                    {validator.current.message("income", formData.amount, "numeric|required")}
                </div>

                <div className="mt-2 w-full flex flex-wrap">
                    <Label htmlFor="date" className="w-full">Date</Label>
                    <div className="flex w-full gap-2 mt-1">
                        { dateButtonOnLeft ? <Button type="button" onClick={e => formDispatch({date: formatDateInput(new Date())})}>Today</Button> : null}
                        <Input type="date" name="date" value={formData.date} onChange={e => formDispatch({date: e.target.value})}/>
                        { !dateButtonOnLeft ? <Button type="button" onClick={e => formDispatch({date: formatDateInput(new Date())})}>Today</Button> : null}
                    </div>
                    {validator.current.message("date", formData.date, "required")}
                </div>

                <div className="mt-2 w-full">
                    <Label htmlFor="bucket">To Bucket</Label>
                    <Select value={formData.bucket} onValueChange={(e: string) => handleBucketUpdate(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a bucket"></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {renderBucketOptions()}
                        </SelectContent>
                    </Select>
                    {validator.current.message("bucket", formData.bucket, "required")}
                </div>
            </DrawerBody>

            <DrawerFooter className="flex flex-row justify-end gap-3 w-full">
                <Button variant="destructive" type="reset" className="rounded-md p-1 min-w-16">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-16">Add Funds</Button>
            </DrawerFooter>
        </form>
    )
}