export default function ShopFooter() {
    return (
        <footer className="flex justify-center items-center px-6 py-5 border-t border-slate-200 bg-white">

            <p className="text-gray-700 text-center text-sm">
                © {new Date().getFullYear()} Proximely - All Rights Reserved | Developed by <span className="font-medium">Jeesan Abbas</span>
            </p>
        </footer>

    )
}