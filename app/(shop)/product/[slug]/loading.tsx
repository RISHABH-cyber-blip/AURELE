export default function ProductLoading() {
    return (
        <div className="px-6 md:px-16 pt-32 pb-24 animate-pulse">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-6xl mx-auto">
                <div className="aspect-square bg-cream-soft rounded-2xl" />
                <div>
                    <div className="h-3 w-20 bg-cream-deep rounded mb-3" />
                    <div className="h-9 w-3/4 bg-cream-deep rounded mb-5" />
                    <div className="h-4 w-full bg-cream-deep rounded mb-2" />
                    <div className="h-4 w-2/3 bg-cream-deep rounded mb-8" />
                    <div className="h-12 w-full bg-cream-soft rounded-full" />
                </div>
            </div>
        </div>
    )
}