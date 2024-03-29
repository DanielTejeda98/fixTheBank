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
// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"

// const DEFAULT_REDIRECT = "/dashboard"

// export async function authenticate(_: any, formData:FormData) {
//     try {
//         const userData = { username: formData.get("username"), password: formData.get("password")}

//         // await authentication
//         let result = null;
//         try {
//             const rawResult = await fetch(`${process.env.NEXT_PUBLIC_FTB_HOST}/api/auth/login`, {
//                 method: 'POST',
//                 body: JSON.stringify(userData)
//             })
//             result = await rawResult.json();
//         } catch (error) {
//             //TODO: throw a ui error
//             console.log(error)
//         }

//         if (result) {
//             cookies().set('session', JSON.stringify(result.data), {
//                 maxAge: 60 * 60 * 24 * 7,
//                 path: '/'
//             })
//         }
//     } catch (error) {
//         if (error) {
//             // do something with the error
//             return 'Error happened'
//         }
//         throw error
//     }

//     const redirectUrl = formData.get("redirect")?.toString();
//     if (redirectUrl) {
//         redirect(redirectUrl)
//     }
//     redirect(DEFAULT_REDIRECT);
// }