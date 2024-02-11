import DashboardView from "../components/Dashboard/DashboardView";
import { getBudget } from "@/app/lib/budgetApi"
import { getUserFromCookie } from "../lib/utilServerHelpers";
import ReduxProvider from "@/redux/provider";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";

export default async function Dashboard() {
    const headers = {
        userId: getUserFromCookie()?._id
    }

    const res = (await getBudget(headers))
    if (res.sucess) {
        const data = res.data;
        const mappedBudget = {
            _id: data._id,
            categories: data.categories,
            accounts: data.accounts,
            income: data.income,
            expenses: data.expenses,
            minDate: data.minDate,
            maxDate: data.maxDate
        }
        return (
            <ReduxProvider>
                <DashboardView budget={mappedBudget} />
            </ReduxProvider>
        )
    } else if (res.error === "No budget found for user") {
        return (
            <JoinOrCreateBudget />
        )
    }
    // eslint-disable-next-line react/no-unescaped-entities
    return (<div>Data didn't load :c</div>)
}