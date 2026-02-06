'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, LayoutDashboard, LogOut, Store } from 'lucide-react'
import { useLogout } from '@/hooks/auth/useLogout'

type Props = {
  name?: string
  avatarUrl?: string
}

export function HeaderProfile({
  name = 'Profile',
  avatarUrl
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { mutate } = useLogout()

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative hidden lg:flex">
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-lg px-3 py-1 hover:bg-gray-100"
      >
        <img
          src={avatarUrl || '/avatar.png'}
          alt="Profile"
          className="w-7 h-7 rounded-full object-cover"
        />
        <span className="text-sm font-medium">Profile</span>
        <ChevronDown size={15} className="text-gray-500" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow z-50 p-2">
          <Link
            href="/shop/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 px-2 py-2 text-sm hover:bg-gray-100 text-gray-500 rounded-md hover:text-gray-700"
          >

            Dashboard
            <LayoutDashboard size={17} className='text-gray-700' />
          </Link>

          <Link
            href="/shop/shop-profile"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between gap-2 px-2 py-2 text-sm hover:bg-gray-100 text-gray-500 rounded-md hover:text-gray-700"
          >

            My Shop
            <Store size={16} className='text-gray-700' />
          </Link>

          <button
            onClick={() => mutate()}
            className="w-full flex items-center justify-between gap-2 px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md hover:text-gray-700"
          >

            Logout
            <LogOut size={16} className='text-gray-700' />
          </button>
        </div>
      )}
    </div>
  )
}
