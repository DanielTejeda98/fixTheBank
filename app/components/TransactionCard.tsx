import { cn } from "@/lib/utils"
import { createContext, ReactNode, useContext } from "react"

type TransactionCardContext = {
    isBlurredContent: boolean
}
const TransactionCardContext = createContext<TransactionCardContext>({} as TransactionCardContext);

function TransactionCardProvider({ children, isBlurredContent = false }: { children: ReactNode, isBlurredContent?: boolean; }) {
    return (
        <TransactionCardContext.Provider value={{isBlurredContent}}>
            {children}
        </TransactionCardContext.Provider>
    )
}

function TransactionCard({ children, ...props }: React.ComponentProps<"button">) {
    const className = cn(
        "flex items-center p-2 gap-2 rounded-md border max-w-[calc(100vw-3rem)]" ,
        props.className
    )
    return (
        <button {...props} data-qa='transaction-card' className={className} >
            {children}
        </button>
    )
}

function TransactionCardImage({ fallback }: { fallback: string }) {
    return (
        <div className="flex rounded-full min-w-10 h-10 justify-center items-center outline-1 outline-slate-700 dark:outline-hidden dark:bg-slate-700 dark:text-white">
            {fallback}
        </div>
    )
}

function TransactionCardLeftBody({
    children
}: {
    children: ReactNode;
}) {
    const { isBlurredContent } = useContext(TransactionCardContext)
    return (
        <div className={cn({ 'blur-sm': isBlurredContent }, "flex flex-col items-start")}>
            {children}
        </div>
    )
}

function TransactionDescription({ children }: { children: ReactNode }) {
    return (
        <p className="text-sm break-words max-w-[calc(100vw-3rem-12rem)] line-clamp-2">{children}</p>
    )
}

function TransactionCardRightBody({
    children
}: {
    children: ReactNode;
}) {
    const { isBlurredContent } = useContext(TransactionCardContext)

    return (
        <div className={cn({'blur-sm': isBlurredContent}, "ml-auto")}>
            {children}
        </div>
    )
}

function TransactionCardDate({
    date
}: {
    date: Date
}) {
    return (
        <p className="text-xs text-end text-neutral-400">{new Date(date).toLocaleString("en-us", {dateStyle: "full", timeZone: "UTC"})}</p>
    )
}

export {
    TransactionCardProvider,
    TransactionCard,
    TransactionCardImage,
    TransactionCardLeftBody,
    TransactionCardRightBody,
    TransactionDescription,
    TransactionCardDate
}