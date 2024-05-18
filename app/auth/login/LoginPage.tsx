"use client"
import { useSearchParams } from "next/navigation";
import { FormEvent, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Input from "@/app/components/atoms/Input";
import useReactValidator from "@/app/hooks/useReactValidator";
import MessageBlock from "@/app/components/atoms/MessageBlock";

const DEFAULT_REDIRECT = "/dashboard"

interface LoginFormData {
    username?: string,
    password?: string,
    redirect?: string,
}

async function signInAction (formData: LoginFormData) {
    try {
        const res = await signIn("credentials", {
            username: formData.username,
            password: formData.password,
            redirect: false
        })
        
        if (res?.error) {
            return res;
        }

        if(!res?.ok) {
            return res
        }

        return res

    } catch (error) {
        return {ok: false, error}
    }
}

export default function LoginPage () {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const params = useSearchParams();
    const redirect = params?.get("callbackUrl")?.toString();

    const validator = useReactValidator();
    const forceUpdate = useReducer(x => x + 1, 0)[1];
    const [formData, formDispatch] = useReducer((state: LoginFormData, action: LoginFormData):LoginFormData => {
        return {...state, ...action}
    }, {
        username: "",
        password: "",
        redirect: redirect,
    })
    const [signInError, setSignInError] = useState("");

    const clearForm = () => {
        formDispatch({
            username: "",
            password: "",
            redirect: redirect,
        })
        validator.current.hideMessages();
    }

    const handleFormSubmit = async (form: FormEvent) => {
        form.preventDefault();
        if (!validator.current.allValid()) {
            validator.current.showMessages();
            forceUpdate();
            return;
        }

        setLoading(true)
        const res = await signInAction(formData)
        if (!res?.ok) {
            setSignInError("There was an error processing the sign in")
            return;
        }
        
        const redirectUrl = formData.redirect?.toString();
        if (redirectUrl) {
            router.replace(redirectUrl)
        } else {
            router.replace(DEFAULT_REDIRECT)
        }
        
        setLoading(false)
        clearForm()
    }
    return (
        <form onSubmit={handleFormSubmit} className="w-3/4 h-fit mt-5 mx-auto bg-white p-2 text-black rounded-md">
            <h1 className="text-2xl font-bold text-center">Log In</h1>
            <p className="mt-1 mb-2 text-sm text-center">Log in to continue</p>

            {!!signInError ? <MessageBlock severity="error">{signInError}</MessageBlock> : null}
            

            <Input id="username"
                   type="text"
                   name="username" 
                   placeholder="Username" 
                   label="Username" 
                   required
                   validation={{
                    validator: validator,
                    data: formData.username,
                    validation: "alpha_num_dash_space|required"
                   }}
                   value={formData.username}
                   onChange={(value:any) => formDispatch({username: value})}/>

            <Input id="password"
                   type="password"
                   name="password"
                   icon="faLock"
                   placeholder="Password" 
                   label="Password"
                   required
                   validation={{
                    validator: validator,
                    data: formData.password,
                    validation: "alpha_num_dash_space|required"
                   }}
                   value={formData.password}
                   onChange={(value:any) => formDispatch({password: value})}/>
                   
            <input type="text" name="redirect" className="hidden" value={redirect} readOnly/>
            <LoginButton loading={loading}/>
            <Link href="/auth/forgot-password" className="mt-3 text-sm">Forgot Password</Link>
        </form>
    )
}

function LoginButton ({loading}: {loading: Boolean}) {
    // !!loading due to button html element wanting a booleanish type
    return (
        <button type="submit" aria-disabled={!!loading} className="mt-3 w-full border rounded-md bg-blue-500 text-white p-1">Login</button>
    )
}