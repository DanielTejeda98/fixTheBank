import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            username: string,
            id: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string,
        username: string,
        email: string
    }
}