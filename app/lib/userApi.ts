import { signOut } from "next-auth/react";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_FTB_HOST}/api`

const createUser = async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/user`, {
        method: "POST",
        body: JSON.stringify(userData)
    })
    return await res.json();
}

const signUserOut = () => {
    localStorage.removeItem("budgetData");
    localStorage.removeItem("userSettings");
    signOut();
}

export {
    createUser,
    signUserOut
}