export default function AccountLoading() {
    return (
        <div className="px-6 md:px-16 pt-32 pb-24 max-w-4xl mx-auto animate-pulse">
            <div className="h-9 w-64 bg-cream-deep rounded mb-8" />
            <div className="grid grid-cols-3 gap-4 mb-16">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-cream-soft rounded-2xl" />
                ))}
            </div>
        </div>
    )
}