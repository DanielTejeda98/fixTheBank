"use client"

import { createBudget } from "@/app/lib/budgetApi";
import { getUserFromCookie } from "@/app/lib/utilClientHelpers";
import { useRouter } from "next/navigation";

export default function JoinOrCreateBudget() {
    const router = useRouter();
    const createNewBudget = async () => {
        try {
            const headers = {
                userId: getUserFromCookie()?._id
            }
            const res = await createBudget(headers);
            if (res.sucess) {
                router.refresh();
            }
        } catch (error) {
            // Todo: display error
            console.log(error)
        }
    }

    return (
        <div>
            <p>No budget found for user, create one or join one</p>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
                <button onClick={createNewBudget} className="bg-slate-500 rounded-md p-1">Create budget</button>
                <button className="bg-slate-500 rounded-md p-1">Join budget</button>
            </div>
        </div>
    )
}