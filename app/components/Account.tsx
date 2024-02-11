"use client"
import { useRouter } from "next/navigation"

export default function Account() {
    const router = useRouter();
    const logout = () => {
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/");
    }

    return (
        <div className="flex flex-wrap">
            <button className="p-2 bg-red-500 text-sm rounded-md ml-auto" onClick={logout}>Log out</button>
        </div>
    )
}