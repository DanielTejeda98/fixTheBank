"use client"
import { useRouter } from "next/navigation";
import { createUser } from "@/app/lib/userApi";
import { FormEvent, useReducer, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";

type FormData = {
    username?: string,
    password?: string,
    email?: string
}

export default function SignUp () {
    const validator = useRef(new SimpleReactValidator());
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
            if (res.sucess) {
                router.push("/login?successful-signup")
            }
        } catch (error) {
            // Todo: display error
            console.log(error)
        }
        setPending(false);
    }

    return (
        <form onSubmit={formSubmit} onReset={clearForm} className="w-3/4 mt-5 mx-auto bg-white p-2 text-black rounded-md">
            <h1 className="text-2xl font-bold text-center">Sign Up</h1>
            <p className="mt-1 mb-2 text-sm text-center">Sign up to continue</p>
            <input type="text" name="username" placeholder="Username" className="w-full p-1 rounded-md" value={formData.username} onChange={e => formDispatch({username: e.target.value})}/>
            { validator.current.message("username", formData.username, "required")}
            <input type="password" name="password" placeholder="Password" className="w-full mt-3 p-1 rounded-md" value={formData.password} onChange={e => formDispatch({password: e.target.value})}/>
            { validator.current.message("password", formData.password, "required")}
            <input type="email" name="email" placeholder="Email" className="w-full mt-3 p-1 rounded-md" value={formData.email} onChange={e => formDispatch({email: e.target.value})}/>
            { validator.current.message("email", formData.email, "required")}
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