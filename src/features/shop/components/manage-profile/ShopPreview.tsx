import {Button} from "@/src/components/ui/button";
import { MapPin } from "lucide-react"

type PropType = {
  name?: string
  address?: string
  category?: string
}

export function ShopPreview({
  name = 'Main Street Books',
  address = '123 Main St, Suite 101, Anytown, NY 10001',
  category = 'Bookstore'
}: PropType) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:max-w-110 w-full">

      {/* Banner */}
      <div className="relative h-36 bg-linear-to-r from-gray-400 to-gray-500">
        {/* Logo */}
        <div className="absolute -bottom-8 left-4">
          <div className="w-20 h-20 bg-white rounded-xl border border-gray-300 shadow flex items-center justify-center overflow-hidden">
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 px-4 pb-5">

        {/* Name */}
        <h2 className="text-lg font-semibold text-gray-900">
          {name}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm mt-1">
          <div className="flex text-yellow-400">
            ★ ★ ★ ★ ☆
          </div>
          <span className="text-gray-500">
            (128 reviews)
          </span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <MapPin size={16} />
          <p>
            {address}
          </p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-3">
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
            {category}
          </span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
            Open Now
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-5 line-clamp-3 border-t border-gray-300 pt-5">
          A cozy haven for book lovers in the heart of Anytown. We specialize
          in rare finds and local authors.
        </p>

        {/* CTA */}
        <Button
          type="button"
          text="View full store"
          className="w-full mt-4"
        />
      </div>
    </div>
  );
}
