"use client"
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation"

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="sticky bottom-0 inset-x-0 h-20 pt-1 w-full self-end transition-all border-t">
            <ul className="grid grid-row-4 grid-flow-col mt-2 mx-2">
                <li>
                    <Link href="/dashboard" className={`flex flex-col p-1 gap-1 items-center ${pathname?.includes('/dashboard') ? 'rounded-lg border' : ''}`}>
                        <div className="w-7 h-7 rounded-full text-center">
                            <FontAwesomeIcon icon={faHouse} />
                        </div>
                        <p className="text-xs">Home</p>
                    </Link>
                </li>
                <li>
                    <Link href="/planner" className={`flex flex-col p-1 gap-1 items-center ${pathname?.includes('/planner') ? 'rounded-lg border' : ''}`}>
                        <div className="w-7 h-7 rounded-full text-center">
                            <FontAwesomeIcon icon={faClipboard} />
                        </div>
                        <p className="text-xs">Plan</p>
                    </Link>
                </li>
                <li>
                    <Link href="#" className="flex flex-col p-1 gap-1 items-center">
                        <div className="w-7 h-7 rounded-full text-center">
                            <FontAwesomeIcon icon={faCoins} />
                        </div>
                        <p className="text-xs">Savings</p>
                    </Link>
                </li>
                <li>
                    <Link href="#" className="flex flex-col p-1 gap-1 items-center">
                        <div className="w-7 h-7 rounded-full text-center">
                            <FontAwesomeIcon icon={faGear} />
                        </div>
                        <p className="text-xs">Settings</p>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}