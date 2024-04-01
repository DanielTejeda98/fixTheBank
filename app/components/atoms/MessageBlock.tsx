type MessageBlockProps = {
    children: React.ReactNode,
    severity: "info" | "warning" | "error"
}

export default function MessageBlock ({children, severity = "info"}: MessageBlockProps) {
    const severityClasses = {
        info: "bg-blue-500 border-blue-700 text-white",
        warning: "bg-yellow-500 border-yellow-700",
        error: "bg-red-500 border-red-800 text-white"
    }
    
    return (
        <div className={"border-solid border-2 p-1 rounded-md text-sm " + severityClasses[severity]}>
            {children}
        </div>
    )
}