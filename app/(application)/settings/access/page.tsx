import AccessList from "@/app/components/Settings/Access/AccessList";
import { Button } from "@/app/components/ui/button";
import normalizeMongooseObjects from "@/app/lib/normalizeMongooseObjects";
import { authOptions } from "@/config/authOptions";
import { getBudgetUsers } from "@/controllers/budgetController";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Access () {
    const userId = (await getServerSession(authOptions))?.user.id;
    const budgetMembers = normalizeMongooseObjects(await getBudgetUsers(new mongoose.Types.ObjectId(userId)));

    return (
        <div className="flex flex-col w-full p-2 gap-2">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-xl font-bold">Manage budget access</h1>
                <Link href="/settings"><Button variant={"ghost"}>Return to settings</Button></Link>
            </div>

            <AccessList owner={budgetMembers.owner} members={budgetMembers.allowed}/>
        </div>
    )
}