export default function FullSizeCard ({children}: {children: React.ReactNode}) {
    return (
        <section className="bg-slate-900 m-3 p-3 rounded-lg">
            {children}
        </section>
    )
}