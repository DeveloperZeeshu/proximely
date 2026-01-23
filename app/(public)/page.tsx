import Image from "next/image"
import {
  History,
  ShoppingBasket,
  Droplet,
  Package,
  ArrowRight,
  Syringe,
} from "lucide-react"
import Container from "@/src/components/container/Container"
import { SearchForm } from "@/src/features/search/components/SearchForm"


const items = [
  {
    name: "Organic Avocado",
    price: "$1.99",
    distance: "0.4 mi",
    shop: "Nature's Best Market",
    img: "/avocado.jpg",
  },
  {
    name: "Gentle Hand Soap",
    price: "$4.50",
    distance: "0.8 mi",
    shop: "CVS Pharmacy",
    img: "/soap.jpg",
  },
  {
    name: "Whole Wheat Bread",
    price: "$2.20",
    distance: "1.1 mi",
    shop: "Fresh Mart",
    img: "/bread.jpg",
  },
  {
    name: "Organic Milk",
    price: "$3.10",
    distance: "0.6 mi",
    shop: "Daily Needs",
    img: "/milk.jpg",
  },
]

const categoryItems = [
  {
    name: "Groceries",
    icon: <ShoppingBasket className="h-4 w-4 text-green-600" />,
    bg: "bg-green-50",
  },
  {
    name: "Personal Care",
    icon: <Droplet className="h-4 w-4 text-blue-600" />,
    bg: "bg-blue-50",
  },
  {
    name: "Staples",
    icon: <Package className="h-4 w-4 text-amber-600" />,
    bg: "bg-amber-50",
  },
  {
    name: "Pharmacy",
    icon: <Syringe className="h-4 w-4 text-purple-600" />,
    bg: "bg-purple-50",
  },
]

export default function Home() {
  return (
    <Container>
      <main className="min-h-screen">
        <div className="w-full">

          {/* SEARCH HERO */}
          <section className="mb-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* LEFT: Search */}
              <div className="max-w-xl">
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold text-slate-800">
                    Find products nearby
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Compare prices and availability across trusted local shops
                  </p>
                </div>
              </div>
            </div>
              <SearchForm />
          </section>


          {/* RECENT SEARCHES */}
          <section className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent searches
              </h2>
              <button className="text-sm text-blue-600 hover:underline">
                Clear
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {["Organic milk", "Face wash", "Whole wheat bread"].map((item) => (
                <button
                  key={item}
                  className="
                flex items-center gap-1
                px-3.5 py-1.5
                rounded-full
                bg-white
                border border-slate-200
                text-xs text-slate-700
                hover:bg-slate-100
              "
                >
                  <History className="h-4 w-4 text-slate-400" />
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* QUICK CATEGORIES */}
          <section className="mb-14">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Quick categories
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
              {categoryItems.map((cat) => (
                <button
                  key={cat.name}
                  className="
                bg-white border border-slate-200
                rounded-xl p-4
                text-sm font-medium text-slate-700
                hover:shadow-sm
                flex flex-col items-center gap-2
              "
                >
                  <div className={`w-10 h-10 rounded-full ${cat.bg} flex items-center justify-center`}>
                    {cat.icon}
                  </div>
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          {/* NEARBY DEALS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Nearby deals
              </h2>
              <button className="text-sm text-blue-500 hover:text-blue-600 flex gap-1">
                View all
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4">
              {items.map((item) => (
                <article
                  key={item.name}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm"
                >
                  <div className="relative h-32">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      loading="eager"
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </p>

                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="text-blue-500 font-semibold">
                        {item.price}
                      </span>
                      <span className="text-slate-400">
                        {item.distance}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {item.shop}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>
    </Container>
  )
}
