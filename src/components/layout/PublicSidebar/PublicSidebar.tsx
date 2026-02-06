'use client'

import { type ElementType } from 'react';
import { House, Link as LinkIcon, PanelRightOpen, Store } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';
import { useAuth } from '@/store/auth/useAuth';

interface NavItem {
    name: string
    slug: string
    icon: ElementType | null
    active: boolean
}

export default function PublicSidebar() {

    const { closeSidebar, isSidebarOpen } = useAppContext()
    const pathname = usePathname()

    const { isAuth, authLoading } = useAuth()

    const navItems: NavItem[] = [
        {
            name: 'Home',
            slug: '/',
            icon: House,
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

    return (
        <>
            <aside className={`border-r border-slate-100 p-4 flex flex-col justify-start bg-white/80  gap-9 z-60 fixed top-0 left-0 h-screen w-74 backdrop-blur-sm transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} rounded-r-lg`}>

                <p className="flex justify-end w-full">
                    <PanelRightOpen
                        className="cursor-pointer text-gray-700 hover:text-gray-600 p-1 rounded-sm hover:bg-gray-200"
                        onClick={closeSidebar}
                        size={27} />
                </p>

                {!authLoading && isAuth &&
                    <Link
                        href="/shop/dashboard"
                        className="px-3.5 py-1.5 text-sm font-medium rounded-md text-white hover:bg-blue-600 bg-blue-500 transition text-center"
                    >
                        My Dashboard
                    </Link>
                }

                {!authLoading && !isAuth &&
                    <div className={`flex justify-center items-center gap-3 h-9`}>
                        <Link
                            href="auth/login"
                            className="text-sm font-medium text-black hover:text-black border bg-gray-50 rounded-md border-gray-300 px-3.5 h-full flex justify-center items-center hover:bg-gray-100 transition duration-150 "
                            onClick={closeSidebar}
                        >
                            Log In
                        </Link>
                        <Link
                            href="auth/register"
                            className="text-sm font-medium border border-blue-500 text-white rounded-md bg-blue-500 px-3.5 h-full flex justify-center items-center hover:bg-blue-600"
                            onClick={closeSidebar}
                        >
                            Register
                        </Link>
                    </div>}

                <nav className="flex flex-col w-full space-y-1 text-sm">
                    {
                        navItems.map((nav) => {
                            const active = pathname === nav.slug
                            return (
                                nav.active &&
                                <Link
                                    key={nav.name}
                                    href={nav.slug}
                                    onClick={closeSidebar}
                                    className={`${active ? 'bg-gray-200' : ''} w-full py-2 text-left duration-200 rounded-lg hover:bg-gray-200 px-2 flex gap-1.5 items-center`}>
                                    {nav.icon && <nav.icon className='text-blue-500' size={19} />}
                                    {nav.name}
                                </Link>)
                        })
                    }
                </nav>
            </aside>
        </>
    )
}

