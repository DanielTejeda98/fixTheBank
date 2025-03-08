import { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Fix The Bank | Budgeting App",
    description: "A budget app to help keep track of a household budget.",
};

export default async function Layout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const doesUserHaveSession = (await getServerSession(authOptions))?.user;

    if (doesUserHaveSession) {
        redirect("/dashboard");
    }
    
    return (
        <html>
            <body className={`${inter.className} flex flex-wrap min-h-dvh bg-background dark`}>
                {children}
            </body>
        </html>
    )
} 