"use client"

import { useFormState, useFormStatus } from "react-dom";

export default function ForgotPassword () {
    const [errorMessage, dispatch] = useFormState(() => {}, undefined)
    
    return (
        <form action={dispatch} className="w-3/4 h-fit mt-5 mx-auto bg-white p-2 text-black rounded-md">
            <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
            <p className="mt-1 mb-2 text-sm text-center">Submit request for new password</p>
            <input type="email" name="email" placeholder="Email" required className="w-full p-1 rounded-md" />
            <SubmitRequestButton />
            <a href="/auth/login" className="mt-3 text-sm">Login</a>
        </form>
    )
}

function SubmitRequestButton () {
    const { pending } = useFormStatus();

    return (
        <button type="submit" aria-disabled={pending} className="mt-3 w-full border rounded-md bg-blue-500 text-white p-1">Request new password</button>
    )
}