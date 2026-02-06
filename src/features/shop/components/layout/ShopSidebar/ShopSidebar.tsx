'use client'

import { type ElementType } from 'react';
import { LayoutDashboard, Link as LinkIcon, LogOut, PanelRightOpen, Settings2, Store, Warehouse } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useLogout } from '@/hooks/auth/useLogout';

interface NavItem {
    name: string
    slug: string
    icon: ElementType | null
    active: boolean
}

export default function ShopSidebar() {
    const router = useRouter()

    const { shopSidebarOpen, closeShopSidebar } = useAppContext()
    const { mutate } = useLogout()
    const { hasShop } = useSelector((state: RootState) => state.auth)

    const pathname = usePathname()

    const navItems: NavItem[] = [
        {
            name: 'Dashboard',
            slug: '/shop/dashboard',
            icon: LayoutDashboard,
            active: true
        },
        {
            name: 'Manage Products',
            slug: "/shop/manage-products?cursor=&limit=10",
            icon: Warehouse,
            active: true
        },
        {
            name: 'Shop Profile',
            slug: '/shop/shop-profile',
            icon: Settings2,
            active: true
        },
        {
            name: 'Shops',
            slug: '/shops',
            icon: Store,
            active: true
        },
        {
            name: 'About Us',
            slug: '/about-us',
            icon: LinkIcon,
            active: true
        }
    ]

    const handleLogout = () => {
        mutate()
        closeShopSidebar()
    }

    return (
        <>
            <aside className={`border-r border-slate-100 p-4 flex flex-col justify-start bg-white/80  gap-9 z-60 fixed top-0 left-0 h-screen w-74 backdrop-blur-sm transition-transform duration-300 ${shopSidebarOpen ? 'translate-x-0' : '-translate-x-full'} rounded-r-lg`}>

                <p className="flex justify-end w-full">
                    <PanelRightOpen
                        className="cursor-pointer text-gray-700 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-200"
                        onClick={closeShopSidebar}
                        size={27} />
                </p>

                {
                    !hasShop &&
                    <Link
                        href="/shop/onboarding"
                        className="text-sm font-medium border border-blue-500 text-white rounded-md bg-blue-500 px-3.5 py-1.5 flex justify-center items-center hover:bg-blue-600"
                        onClick={closeShopSidebar}
                    >
                        Create Shop
                    </Link>
                }

                <div className='flex flex-col justify-between h-full'>
                    <nav className="flex flex-col w-full space-y-1 text-sm">
                        {
                            navItems.map((nav) => {
                                const active = pathname === nav.slug
                                return (
                                    nav.active &&
                                    <Link
                                        key={nav.name}
                                        href={nav.slug}
                                        onClick={closeShopSidebar}
                                        className={`${active ? 'bg-gray-200' : ''} w-full py-2 text-left duration-200 rounded-lg hover:bg-gray-200 px-2 flex gap-1.5 items-center`}>
                                        {nav.icon && <nav.icon className='text-blue-500' size={19} />}
                                        {nav.name}
                                    </Link>)
                            })
                        }
                    </nav>
                    <button
                        onClick={handleLogout}
                        className={` w-full py-2 text-left duration-200 rounded-lg hover:bg-gray-200 px-2 flex gap-1.5 items-center text-sm`}>
                        <LogOut className='text-blue-500' size={19} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    )
}

