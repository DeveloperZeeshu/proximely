import Image from "next/image"
import {
  ShoppingBasket,
  Droplet,
  Package,
  ArrowRight,
  Syringe,
} from "lucide-react"
import Container from "@/components/container/Container"
import { SearchForm } from "@/features/search/components/SearchForm"


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

        {/* HERO SEARCH */}
        <section className="text-center max-w-2xl mx-auto mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Find products near you
          </h1>

          <p className="text-slate-500 mt-2 text-sm sm:text-base">
            Compare prices & availability across trusted local shops
          </p>

          <div className="mt-8">
            <SearchForm />
          </div>
        </section>

        {/* QUICK CATEGORIES */}
        <section className="mb-16">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Popular categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categoryItems.map((cat) => (
              <button
                key={cat.name}
                className="
                  bg-white border border-slate-200
                  rounded-xl p-4
                  text-sm font-medium text-slate-700
                  hover:shadow-sm hover:border-slate-300
                  transition
                  flex flex-col items-center gap-2
                "
              >
                <div className={`w-11 h-11 rounded-full ${cat.bg} flex items-center justify-center`}>
                  {cat.icon}
                </div>
                {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* NEARBY DEALS */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Deals near you
            </h2>

            <button className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <article
                key={item.name}
                className="
                  bg-white border border-slate-200 rounded-xl
                  overflow-hidden hover:shadow-sm transition
                "
              >
                <div className="relative h-32">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    priority={i === 0}
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {item.name}
                  </p>

                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-blue-600 font-semibold">
                      {item.price}
                    </span>
                    <span className="text-slate-400 text-xs">
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

      </main>
    </Container>
  )
}
