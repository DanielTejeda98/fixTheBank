import { cookies } from "next/headers"

export const getUserFromCookie = () => {
    return JSON.parse(cookies().get("session")?.value || "");
}