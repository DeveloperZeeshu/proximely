export const HeaderSkeleton = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
            <div className="mx-auto flex h-13 items-center justify-between px-4 lg:px-6 max-w-7xl animate-pulse">

                {/* LEFT: Menu + Logo */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-center">
                    {/* Mobile menu icon */}
                    <div className="lg:hidden h-6 w-6 rounded bg-slate-200" />

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded bg-slate-200" />
                        <div className="h-4 w-24 rounded bg-slate-200" />
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2 ml-8">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-7 w-20 rounded-full bg-slate-200"
                        />
                    ))}
                </nav>

                {/* RIGHT: Create Shop + Profile */}
                <div className="flex items-center gap-4">
                    {/* Create shop button */}
                    <div className="h-9 w-28 rounded-md bg-slate-200 hidden sm:block" />

                    {/* Profile avatar */}
                    <div className="h-9 w-9 rounded-full bg-slate-200" />
                </div>

            </div>
        </header>
    )
}
