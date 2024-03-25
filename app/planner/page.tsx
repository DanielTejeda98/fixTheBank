import Navigation from "../components/Navigation";
import PlannerView from "../components/Planner/PlannerView";
import { getBudgetRequesters, getUserFullBudgetDocument } from "@/controllers/budgetController";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import { redirect } from "next/navigation";
import { BudgetView } from "@/types/budget";

const normalizeMongooseObjects = (object: any) => {
    return JSON.parse(JSON.stringify(object))
}

export default async function Planner () {
    const session = await getServerSession(authOptions)
    const userId = new mongoose.Types.ObjectId(session?.user?.id)

    try {
        const data = await getUserFullBudgetDocument(userId, new Date())
        if (!data) {
            redirect(`${process.env.NEXT_PUBLIC_FTB_HOST}`);
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
        } as BudgetView

        return (
            <>
                <PlannerView budget={mappedBudget}/>
                <Navigation />
            </>
        )
    } catch (error) {
        console.log(error);
        return (
            <>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <div>Data didn't load :c</div>
                <Navigation />
            </>
            )
    }

    
}