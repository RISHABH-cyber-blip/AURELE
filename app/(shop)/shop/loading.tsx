export default function ShopLoading() {
    return (
        <div className="px-6 md:px-12 pt-32 pb-24 animate-pulse">
            <div className="h-4 w-24 bg-cream-deep rounded mb-4" />
            <div className="h-10 w-48 bg-cream-deep rounded mb-12" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i}>
                        <div className="aspect-square bg-cream-soft rounded-2xl mb-4" />
                        <div className="h-3 w-16 bg-cream-deep rounded mb-2" />
                        <div className="h-4 w-32 bg-cream-deep rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}