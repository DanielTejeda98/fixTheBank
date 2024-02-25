"use client"

import { createBudget } from "@/app/lib/budgetApi";
import { useRouter } from "next/navigation";
import FullSizeCard from "../FullSizeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Drawer from "../Drawer";
import { useState } from "react";
import Account from "../Account";
import JoinBudget from "./JoinBudget";
import { useSession } from "next-auth/react";

export default function JoinOrCreateBudget() {
    const userId = useSession().data?.user.id;
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerComponent, setDrawerComponent] = useState("account");

    type ComponentString = "account" | "join"
    const toggleDrawer = (component: ComponentString) => {
        setDrawerComponent(component);
        setIsDrawerOpen(!isDrawerOpen);
    }

    const DrawerComponents = {
        join: <JoinBudget closeDrawer={() => setIsDrawerOpen(false)}/>,
        account: <Account closeDrawer={() => setIsDrawerOpen(false)} />
    }

    const createNewBudget = async () => {
        try {
            const res = await createBudget({userId});
            if (res.success) {
                router.refresh();
            }
        } catch (error) {
            // Todo: display error
            console.log(error)
        }
    }

    return (
        <div>
            <FullSizeCard>
                <div>
                    <button className="bg-slate-500 p-2 w-10 h-10 text-center rounded-full" onClick={() => toggleDrawer("account")}><FontAwesomeIcon icon={faUser} /></button>
                </div>
                <div className="mt-5">
                    <p>No budget found for user, create one or join one</p>
                </div>
                <div className="flex flex-wrap gap-1 justify-center mt-2">
                    <button onClick={createNewBudget} className="bg-slate-500 rounded-md p-1">Create budget</button>
                    <button className="bg-slate-500 rounded-md p-1" onClick={() => toggleDrawer("join")}>Join budget</button>
                </div>
            </FullSizeCard>
            <Drawer isOpen={isDrawerOpen}
                    closeDrawer={() => setIsDrawerOpen(false)}>
                {DrawerComponents[drawerComponent as keyof typeof DrawerComponents]}
            </Drawer>
        </div>
    )
}