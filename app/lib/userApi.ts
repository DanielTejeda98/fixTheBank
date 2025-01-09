import { User } from "@/types/user";
import { signOut } from "next-auth/react";
import { UserCacheProvider } from "./userCache";
import { setUser } from "@/redux/features/user-slice";
import { store } from "@/redux/store";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`

const createUser = async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        body: JSON.stringify(userData)
    })
    return await res.json();
}

const getUser = async (useCache?: boolean): Promise<User|undefined> => {
    
    if (useCache) {
        try {
            const cachedUser = UserCacheProvider.getCachedUser();
            if (cachedUser) {
                store.dispatch(setUser(cachedUser));
                return cachedUser;
            }
        } catch (error) {
            // do nothing if it fails
        }
    }
    
    try {
        const res = await fetch(`${API_BASE_URL}/user`);
        const parsedData = await res.json()

        if (!parsedData) {
            throw "Could not retrieve user data";
        }

        UserCacheProvider.cacheUserResponse(parsedData);
        store.dispatch(setUser(parsedData));
        return parsedData;
    } catch (error) {
        console.log(error);
        return;
    }
}

const signUserOut = () => {
    localStorage.removeItem("budgetData");
    localStorage.removeItem("userSettings");
    signOut();
}

export {
    createUser,
    signUserOut,
    getUser
}