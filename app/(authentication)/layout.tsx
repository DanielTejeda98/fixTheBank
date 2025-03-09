import { getServerSession } from "next-auth";
import { authOptions } from "@/config/authOptions";
import { redirect } from "next/navigation";

export default async function Layout ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const doesUserHaveSession = (await getServerSession(authOptions))?.user;

    if (doesUserHaveSession) {
        redirect("/dashboard");
    }
    
    return children
} 