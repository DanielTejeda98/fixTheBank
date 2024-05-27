export default function FullSizeCard ({children}: {children: React.ReactNode}) {
    return (
        <section className="m-3 p-3 rounded-lg border shadow-sm">
            {children}
        </section>
    )
}