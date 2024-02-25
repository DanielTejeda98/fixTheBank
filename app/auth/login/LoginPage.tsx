"use client"
import { useSearchParams } from "next/navigation";
import { FormEvent, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import SimpleReactValidator from "simple-react-validator";
import Link from "next/link";

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

    const validator = useRef(new SimpleReactValidator());
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
        }
        
        setLoading(false)
        clearForm()
    }
    return (
        <form onSubmit={handleFormSubmit} className="w-3/4 mt-5 mx-auto bg-white p-2 text-black rounded-md">
            <h1 className="text-2xl font-bold text-center">Log In</h1>
            <p className="mt-1 mb-2 text-sm text-center">Log in to continue</p>
            <input type="text" name="username" placeholder="Username" required className="w-full p-1 rounded-md" value={formData.username} onChange={e => formDispatch({username: e.target.value})}/>
            {validator.current.message("username", formData.username, "alpha_num_dash_space|required")}
            <input type="password" name="password" placeholder="Password" required className="w-full mt-3 p-1 rounded-md" value={formData.password} onChange={e => formDispatch({password: e.target.value})}/>
            {validator.current.message("password", formData.password, "alpha_num_dash_space|required")}
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