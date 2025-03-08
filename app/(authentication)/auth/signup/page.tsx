"use client"
import { useRouter } from "next/navigation";
import { createUser } from "@/app/lib/userApi";
import { FormEvent, useReducer, useState } from "react";
import Input from "@/app/components/atoms/Input";
import useReactValidator from "@/app/hooks/useReactValidator";

type FormData = {
    username?: string,
    password?: string,
    email?: string
}

export default function SignUp () {
    const validator = useReactValidator()
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const [formData, formDispatch] = useReducer((state: FormData, action: FormData):FormData => {
        return {...state, ...action}
    }, {
        username: "",
        password: "",
        email: ""
    })

    const clearForm = () => {
        formDispatch({
            username: "",
            password: "",
            email: ""
        })
        validator.current.hideMessages();
    }

    const formSubmit = async (form: FormEvent) => {
        form.preventDefault();
        setPending(true);
        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            setPending(false);
            return;
        }
        try {
            const res = await createUser(formData);
            if (res.success) {
                router.push("/login?successful-signup")
            }
        } catch (error) {
            // Todo: display error
            console.log(error)
        }
        setPending(false);
    }

    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="w-3/4 h-fit mt-5 mx-auto bg-white p-2 text-black rounded-md">
            <h1 className="text-2xl font-bold text-center">Sign Up</h1>
            <p className="mt-1 mb-2 text-sm text-center">Sign up to continue</p>
            <Input type="text"
                   id="username"
                   name="name"
                   label="Username"
                   placeholder="Username"
                   value={formData.username}
                   required
                   onChange={(value: string) => formDispatch({username: value})}
                   validation={{
                    validator: validator,
                    data: formData.username,
                    validation: "required"
                   }} />
            <Input type="password"
                   id="password"
                   name="password"
                   label="Password"
                   placeholder="Password"
                   icon="faLock"
                   value={formData.password}
                   required
                   onChange={(value: string) => formDispatch({password: value})}
                   validation={{
                    validator: validator,
                    data: formData.password,
                    validation: "required"
                   }} />
            <Input type="email"
                   id="email"
                   name="email"
                   label="Email"
                   placeholder="Email@email.com"
                   icon="faEnvelope"
                   value={formData.email}
                   required
                   onChange={(value: string) => formDispatch({email: value})}
                   validation={{
                    validator: validator,
                    data: formData.email,
                    validation: "required"
                   }} />
            
            <ConfirmButton pending={pending}/>
            <button type="reset" className="mt-3 w-full border rounded-md bg-red-500 text-white p-1">Clear</button>
            <p>Already have an account?</p>
            <a href="/auth/login" className="mt-3 text-sm">Login</a>
        </form>
    )
}

function ConfirmButton ({pending}: {pending: boolean}) {
    return (
        <button type="submit" aria-disabled={pending} disabled={pending} className="mt-3 w-full border rounded-md bg-blue-500 text-white p-1">Sign Up</button>
    )
}