export default function NotificationCard({
    children
}: {children?: React.ReactNode}) {
    return (
        <div className="flex items-center p-2 bg-slate-800 gap-2 rounded-md">
            <div className="rounded-full w-10 h-10 bg-slate-300 flex-shrink-0"></div>
            { children }
        </div>
    )
}