"use client"

import { signIn } from "next-auth/react"

const DEFAULT_REDIRECT = "/dashboard"

export async function authenticate(_: any, formData: FormData) {

    try {
        const res = await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false
        })
        
        if (res?.error) {
            return res.error;
        }

        if(!res?.ok) {
            return "Sign in response not OK"
        }

        return res?.ok

    } catch (error) {
        throw error
    }
}