import DashboardView from "../components/Dashboard/DashboardView";
import { getBudget } from "@/app/lib/budgetApi"
import { getUserFromCookie } from "../lib/utilServerHelpers";
import ReduxProvider from "@/redux/provider";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";
import { getBudgetRequesters } from "@/controllers/budgetController";
import mongoose from "mongoose";

export default async function Dashboard() {
    const user = getUserFromCookie()
    const headers = {
        userId: user?._id
    }

    const res = (await getBudget(headers))
    if (res.success) {
        const data = res.data;
        let requesters: mongoose.Types.Array<mongoose.Types.ObjectId> | never[] = [];
        if(data.isShared && data.isOwner) {
            try {
                // Need to parse and stringify to bypass issues with NextJS passing non standard objects
                requesters = JSON.parse(JSON.stringify(await getBudgetRequesters(new mongoose.Types.ObjectId(user._id), new mongoose.Types.ObjectId(data._id))));
            } catch (error) {
                console.log(error)
            }
        }
        const mappedBudget = {
            _id: data._id,
            categories: data.categories,
            accounts: data.accounts,
            income: data.income,
            expenses: data.expenses,
            minDate: data.minDate,
            maxDate: data.maxDate,
            isShared: data.isShared,
            shareCode: data.shareCode,
            isOwner: data.isOwner,
            joinRequests: requesters,
        }
        return (
            <ReduxProvider>
                <DashboardView budget={mappedBudget} user={user}/>
            </ReduxProvider>
        )
    } else if (res.error === "No budget found for user") {
        return (
            <ReduxProvider>
                <JoinOrCreateBudget user={user}/>
            </ReduxProvider>
        )
    }
    // eslint-disable-next-line react/no-unescaped-entities
    return (<div>Data didn't load :c</div>)
}