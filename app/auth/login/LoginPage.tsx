"use client"
import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { authenticate } from "../../lib/authenticate";

export default function LoginPage () {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)
    const params = useSearchParams();
    const redirect = params?.get("redirect")?.toString();
    return (
        <form action={dispatch} className="w-3/4 mt-5 mx-auto bg-white p-2 text-black rounded-md">
            <h1 className="text-2xl font-bold text-center">Log In</h1>
            <p className="mt-1 mb-2 text-sm text-center">Log in to continue</p>
            <input type="text" name="username" placeholder="Username" required className="w-full p-1 rounded-md" />
            <input type="password" name="password" placeholder="Password" required className="w-full mt-3 p-1 rounded-md" />
            <input type="text" name="redirect" className="hidden" value={redirect} readOnly/>
            <LoginButton />
            <a href="/auth/forgot-password" className="mt-3 text-sm">Forgot Password</a>
        </form>
    )
}

function LoginButton () {
    const { pending } = useFormStatus();

    return (
        <button type="submit" aria-disabled={pending} className="mt-3 w-full border rounded-md bg-blue-500 text-white p-1">Login</button>
    )
}