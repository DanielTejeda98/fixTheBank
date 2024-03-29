import DashboardView from "../components/Dashboard/DashboardView";
import JoinOrCreateBudget from "../components/Dashboard/JoinOrCreateBudget";
import { getBudgetRequesters, getUserFullBudgetDocument } from "@/controllers/budgetController";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import Navigation from "../components/Navigation";


const normalizeMongooseObjects = (object: any) => {
    return JSON.parse(JSON.stringify(object))
}

export default async function Dashboard() {
    const session = await getServerSession(authOptions)
    const userId = new mongoose.Types.ObjectId(session?.user?.id)
    try {
        const data = await getUserFullBudgetDocument(userId, new Date())
        if (!data) {
            return (
                <>
                    <JoinOrCreateBudget />
                    <Navigation />
                </>
            )
        }

        let requesters: mongoose.Types.Array<mongoose.Types.ObjectId> | never[] = [];
        if(data.isShared && data.isOwner) {
            try {
                // Need to parse and stringify to bypass issues with NextJS passing non standard objects
                requesters = normalizeMongooseObjects(await getBudgetRequesters(userId, new mongoose.Types.ObjectId(data._id)));
            } catch (error) {
                console.log(error)
            }
        }
        const mappedBudget = {
            _id: data._id.toString(),
            categories: data.categories,
            accounts: data.accounts,
            income: normalizeMongooseObjects(data.income),
            expenses: normalizeMongooseObjects(data.expenses),
            minDate: data.minDate,
            maxDate: data.maxDate,
            isShared: data.isShared,
            shareCode: data.shareCode,
            isOwner: data.isOwner,
            joinRequests: requesters,
        }
        return (
            <>
                <DashboardView budget={mappedBudget} />
                <Navigation />
            </>
        )

    } catch (error) {
        console.log(error);
        // eslint-disable-next-line react/no-unescaped-entities
        return (
            <>
                <div>Data didn't load :c</div>
                <Navigation />
            </>
            )
    }
}