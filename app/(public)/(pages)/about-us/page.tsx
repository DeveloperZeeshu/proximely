'use client'

import Container from "@/src/components/container/Container"
import { Card, CardContent, CardDescription, CardTitle } from "@/src/components/ui/card"
import { MapPin, Store, Search, ShieldCheck, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

type ListItemType = {
  icon: LucideIcon
  color: string
  title: string
  desc: string
}

const listItems: ListItemType[] = [
  {
    icon: Search,
    color: 'text-blue-600',
    title: "Search products",
    desc: "Find everyday products available in shops around you.",
  },
  {
    icon: Store,
    color: 'text-green-600',
    title: "Compare nearby shops",
    desc: "See which local stores have stock and at what price.",
  },
  {
    icon: MapPin,
    color: 'text-amber-600',
    title: "Shop locally",
    desc: "Save time and support nearby businesses.",
  },
  {
    icon: ShieldCheck,
    color: 'text-indigo-600',
    title: "Trusted listings",
    desc: "Verified shops with up-to-date availability.",
  },
]

export default function About() {
  return (
    <Container>
      <main className="min-h-screen">
        <div className="flex flex-col gap-18">

          {/* HERO */}
          <section className="max-w-3xl">
            <h1 className="text-3xl font-semibold text-slate-900">
              Helping you shop smarter, locally
            </h1>
            <p className="text-slate-600 mt-3 leading-relaxed">
              Proximely connects customers with nearby stores so they can check
              availability, compare prices, and shop locally without wasting time.
            </p>
          </section>

          {/* WHAT WE DO */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-8">
              What Proximely does
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {listItems.map((item) => (
                <div
                  key={item.title}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* WHO IT IS FOR */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-8">
              Who Proximely is for
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-8">
              <Card
                className="">
                <CardTitle>For Customers</CardTitle>
                <CardContent>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                    <li>Search products available near your location</li>
                    <li>Compare prices before visiting a shop</li>
                    <li>Save time by finding the right store first</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardTitle>For Shop Owners</CardTitle>
                <CardContent>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                    <li>Register your shop and create a public profile</li>
                    <li>List products with stock and pricing</li>
                    <li>Get discovered by nearby customers</li>
                    <li>Manage products from one dashboard</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* WHY IT MATTERS */}
            <Card 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
              <div>
                <CardTitle className="mb-5 text-xl">Why Proximely exists</CardTitle>
                <CardDescription>
                  Local shops have inventory, but no online visibility.
                  Customers want speed, but not guesswork.
                  Proximely bridges this gap by bringing local inventory online.
                </CardDescription>
              </div>

              <div className="flex items-center gap-4">
                <Users className="h-10 w-10 text-blue-600" />
                <p className="text-sm text-slate-600">
                  Built for people who value speed, transparency,
                  and supporting local businesses.
                </p>
              </div>
            </Card>

          {/* HOW IT WORKS */}
          <section className="max-w-3xl">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              How Proximely works
            </h2>
            <ol className="text-slate-600 space-y-2 list-decimal pl-5">
              <li>Customers search for a product</li>
              <li>Proximely shows nearby shops with availability</li>
              <li>Customers choose a shop and visit directly</li>
              <li>Shops gain visibility without expensive marketing</li>
            </ol>
          </section>

          {/* VISION */}
          <section className="max-w-3xl">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Our vision
            </h2>
            <p className="text-slate-600 leading-relaxed">
              To become the go-to platform for discovering nearby products —
              helping local shops grow digitally while giving customers a faster,
              smarter way to shop locally.
            </p>
          </section>

          {/* CTA */}
          <Card>
            <CardTitle className="text-xl">
              Start using Proximely
            </CardTitle>
            <CardDescription>
              Whether you’re searching for a product or growing your shop,
              Proximely helps you connect locally.
            </CardDescription>

            <div className="flex flex-wrap gap-4 mt-3">
              <Link
                href='/'
                className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600">
                Search nearby products
              </Link>
              <Link
                href='/auth/register'
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-gray-50">
                Register your shop
              </Link>
            </div>
          </Card>

        </div>
      </main>
    </Container>
  )
}
