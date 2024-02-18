"use client"

import { createBudget } from "@/app/lib/budgetApi";
import { getUserFromCookie } from "@/app/lib/utilClientHelpers";
import { useRouter } from "next/navigation";
import FullSizeCard from "../FullSizeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Drawer from "../Drawer";
import { useEffect, useState } from "react";
import Account from "../Account";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/user-slice";
import JoinBudget from "./JoinBudget";

interface User {
    _id: string,
    username: string,
    email: string
}

function useSetInitialStore(user: User) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setUser(user))
    }, [user, dispatch])
}

export default function JoinOrCreateBudget({user}: {user: User}) {
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerComponent, setDrawerComponent] = useState("account");

    useSetInitialStore(user);

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
            const headers = {
                userId: getUserFromCookie()?._id
            }
            const res = await createBudget(headers);
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