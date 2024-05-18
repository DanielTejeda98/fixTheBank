"use client"

import { createContext } from "react"
interface ContextProps { initialData: any }
export const InitialBudgetDataContext = createContext<ContextProps | undefined>(undefined); 
export default function BudgetProvider ({
    children,
    initialData
}: {
    children: React.ReactNode,
    initialData: any
}) {
    return (
        <InitialBudgetDataContext.Provider value={{initialData}}>
            {children}
        </InitialBudgetDataContext.Provider>
    )
}