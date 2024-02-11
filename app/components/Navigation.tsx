"use client"
import Link from "next/link";
import { usePathname } from "next/navigation"

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="sticky bottom-0 inset-x-0 h-20 bg-slate-800 pt-1 w-full self-end transition-all">
            <ul className="grid grid-row-4 grid-flow-col mt-2 mx-2">
                <li>
                    <Link href="/dashboard" className={`flex flex-col p-1 gap-1 items-center ${pathname?.includes('/dashboard') ? 'bg-slate-700 rounded-lg' : ''}`}>
                        <div className="w-7 h-7 rounded-full bg-slate-500"></div>
                        <p className="text-xs">Home</p>
                    </Link>
                </li>
                <li>
                    <Link href="/planner" className={`flex flex-col p-1 gap-1 items-center ${pathname?.includes('/planner') ? 'bg-slate-700 rounded-lg' : ''}`}>
                        <div className="w-7 h-7 rounded-full bg-slate-500"></div>
                        <p className="text-xs">Plan</p>
                    </Link>
                </li>
                <li>
                    <Link href="#" className="flex flex-col p-1 gap-1 items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-500"></div>
                        <p className="text-xs">Savings</p>
                    </Link>
                </li>
                <li>
                    <Link href="#" className="flex flex-col p-1 gap-1 items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-500"></div>
                        <p className="text-xs">Settings</p>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}