import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, SessionStrategy } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { verify } from "@/app/lib/passwordHasher";
import userModel from "@/models/userModel";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                const {username, password} = credentials as {
                    username: string,
                    password: string
                };

                try {
                    await dbConnect()
                    const user = await userModel.findOne({
                        username
                    })

                    if (!user) {
                        return null;
                    }
                    const isEqual = await verify(password, user.password);
                    if(!isEqual) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    console.log(error)
                }
            }
        })
    ],
    session: {
        strategy: "jwt" as SessionStrategy
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login"
    },
    callbacks: {
        async jwt({token, user, account }: {token: any, user: any, account: any}) {
            if (account && user) {
                token.user = {
                    id: user._id.toString(),
                    email: user.email
                }
            }

            return token;
        },
        async session({session, token}: {session: any, token: any}) {
            session.user = token.user
            return session
        }
    }
}