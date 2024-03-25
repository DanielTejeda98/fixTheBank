import SimpleReactValidator from "simple-react-validator";
import { FormEvent, useReducer, useRef } from "react";
import { createExpense, getBudget } from "@/app/lib/budgetApi";
import { setBudget } from "@/redux/features/budget-slice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";

interface FormData {
    amount?: number,
    account?: string
    category?: string
    date?: string
    description?: string
}

export default function AddExpense({ closeDrawer, budgetId, accounts, categories }: { closeDrawer: Function, budgetId: string, accounts: string[], categories: string[] }) {
    const userId = useSession().data?.user?.id;
    const validator = useRef(new SimpleReactValidator());
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const reduxDispatch = useDispatch();
    const [formData, dispatch] = useReducer((state: FormData, action: FormData): FormData => {
        return { ...state, ...action }
    }, {
        amount: 0,
        account: accounts?.length > 0 ? accounts[0] : "",
        category: categories?.length > 0 ? categories[0] : "",
        date: "",
        description: ""
    })

    const clearForm = () => {
        dispatch({
            amount: 0,
            account: accounts?.length > 0 ? accounts[0] : "",
            category: categories?.length > 0 ? categories[0] : "",
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
            const res = await getBudget({ userId })
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
        return accounts.map(account => <option key={account} value={account}>{account}</option>)
    }

    const renderCategoryOptions = () => {
        return categories.map(category => <option key={category} value={category}>{category}</option>)
    }

    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="flex flex-wrap">
            <h2 className="text-lg font-bold w-full">Add Expense</h2>
            <p className="text-sm w-full">Add an expense for this month</p>
            <div className="mt-2">
                <label htmlFor="amount">Amount</label>
                <input type="number" name="amount" className="ml-2 bg-slate-700" value={formData.amount} onChange={e => dispatch({ amount: Number(e.target.value) })} />
                {validator.current.message("amount", formData.amount, "numeric|required")}
            </div>

            <div className="mt-2">
                <label htmlFor="account">Account</label>
                <select className="ml-2 bg-slate-700" value={formData.account} onChange={e => dispatch({ account: e.target.value })}>
                    {renderAccountOptions()}
                </select>
                {validator.current.message("account", formData.account, "alpha_space|required")}
            </div>

            <div className="mt-2">
                <label htmlFor="category">Category</label>
                <select className="ml-2 bg-slate-700" value={formData.category} onChange={e => dispatch({ category: e.target.value })}>
                    {renderCategoryOptions()}
                </select>
                {validator.current.message("category", formData.category, "required")}
            </div>

            <div className="mt-2">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" className="ml-2 bg-slate-700" value={formData.date} onChange={e => dispatch({ date: e.target.value })} />
                {validator.current.message("date", formData.date, "alpha_num_dash_space|required")}
            </div>

            <div className="mt-2">
                <label htmlFor="description">Description</label>
                <input type="text" name="description" className="ml-2 bg-slate-700" value={formData.description} onChange={e => dispatch({ description: e.target.value })} />
                {validator.current.message("description", formData.description, "alpha_num_dash_space|required")}
            </div>

            <div className="flex justify-end gap-3 w-full mt-5">
                <button type="submit" className="bg-slate-500 rounded-md p-1">Add Expense</button>
                <button type="reset" className="bg-red-700 rounded-md p-1">Clear</button>
            </div>
        </form>
    )
}