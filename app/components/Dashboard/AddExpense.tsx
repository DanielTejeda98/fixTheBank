import { FormEvent, useReducer, useRef } from "react";
import { createExpense, getBudget } from "@/app/lib/budgetApi";
import { setBudget } from "@/redux/features/budget-slice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { AccountView, CategoryView } from "@/types/budget";
import useReactValidator from "@/app/hooks/useReactValidator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatDateInput } from "@/app/lib/renderHelper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppSelector } from "@/redux/store";

interface FormData {
    amount?: number,
    account?: string
    category?: string,
    date?: string
    description?: string
}

export default function AddExpense({ closeDrawer, budgetId, accounts, categories }: { closeDrawer: Function, budgetId: string, accounts: AccountView[], categories: CategoryView[] }) {
    const userId = useSession().data?.user?.id;
    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const reduxDispatch = useDispatch();
    const dateButtonOnLeft = useAppSelector((state) => state.settingsReducer.value.dateTodayButtonOnLeft);
    const [formData, dispatch] = useReducer((state: FormData, action: FormData): FormData => {
        return { ...state, ...action }
    }, {
        amount: undefined,
        account: accounts?.length > 0 ? accounts[0]._id : "",
        category: categories?.length > 0 ? categories[0]._id : "",
        date: "",
        description: ""
    })

    const clearForm = () => {
        dispatch({
            amount: undefined,
            account: accounts?.length > 0 ? accounts[0]._id : "",
            category: categories?.length > 0 ? categories[0]._id : "",
            date: "",
            description: ""
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
            await createExpense({ userId }, { ...formData, budgetId });
            const budgetDate = sessionStorage.getItem("selectedBudgetDate") || '';
            const res = await getBudget({ userId }, budgetDate)
            // Set store values
            reduxDispatch(setBudget(res.data));
        } catch (error) {
            // TODO: display error
            console.log(error)
        }
        closeDrawer();
        clearForm();
    }

    const renderAccountOptions = () => {
        return accounts.map(account => <SelectItem key={account._id} value={account._id}>{account.name}</SelectItem>)
    }

    const renderCategoryOptions = () => {
        return categories.map((category: CategoryView) => <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)
    }

    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap">
            <h2 className="text-lg font-bold w-full">Add Expense</h2>
            <p className="text-sm w-full">Add an expense for this month</p>
            <div className="mt-2 w-full">
                <Label htmlFor="amount">Amount</Label>
                <Input type="number" name="amount" value={formData.amount || ""} onChange={e => dispatch({ amount: Number(e.target.value) })} />
                {validator.current.message("amount", formData.amount, "numeric|required")}
            </div>

            <div className="mt-2 w-full">
                <Label htmlFor="account">Account</Label>
                <Select defaultValue={formData.account} onValueChange={(e: string) => dispatch({ account: e})}>
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
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={formData.category} onValueChange={(e: string) => dispatch({ category: e})}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {renderCategoryOptions()}
                    </SelectContent>
                </Select>
                {validator.current.message("category", formData.category, "required")}
            </div>

            <div className="mt-2 w-full">
                <Label htmlFor="date">Date</Label>
                <div className="flex w-full gap-2 mt-1">
                    { dateButtonOnLeft ? <Button type="button" onClick={e => dispatch({date: formatDateInput(new Date())})}>Today</Button> : null }
                    <Input type="date" name="date" value={formData.date} onChange={e => dispatch({date: e.target.value})}/>
                    { !dateButtonOnLeft ? <Button type="button" onClick={e => dispatch({date: formatDateInput(new Date())})}>Today</Button> : null }
                </div>
                {validator.current.message("date", formData.date, "required")}
            </div>

            <div className="mt-2 w-full">
                <Label htmlFor="description">Description</Label>
                <Input type="text" name="description" value={formData.description} onChange={e => dispatch({ description: e.target.value })} />
                {validator.current.message("description", formData.description, "required")}
            </div>

            <div className="flex justify-end gap-3 w-full mt-5">
                <Button type="reset" variant="destructive" className="rounded-md p-1 min-w-32">Clear</Button>
                <Button type="submit" className="rounded-md p-1 min-w-32">Add Expense</Button>
            </div>
        </form>
    )
}