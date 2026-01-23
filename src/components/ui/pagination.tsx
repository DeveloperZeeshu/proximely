import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import React from "react";


export const Pagination = ({
    className,
    ...props
}: React.ComponentProps<'nav'>) => {
    return (
        <nav
            aria-label="pagination"
            role="navigation"
            className={cn("flex items-center justify-center gap-1 mt-8", className)}
            {...props}
        />
    )
}

export const PaginationPrevious = ({
    className,
    ...props
}: React.ComponentProps<'button'>) => {
    return (
        <button
            aria-label="Go to previous page"
            className={cn("flex items-center gap-1 rounded-md px-2.5 py-2 text-sm",
                "hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", className)}
            {...props}
        >
            <ChevronLeft size={15} />
            <span className="hidden sm:block">Previous</span>
        </button>
    )
}

export const PaginationNext = ({
    className,
    ...props
}: React.ComponentProps<'button'>) => {
    return (
        <button
            aria-label="Go to Next page"
            className={cn("flex items-center gap-1 rounded-md px-2.5 py-2 text-sm",
                "hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500", className)}
            {...props}
        >
            <span className="hidden sm:block">Next</span>
            <ChevronRight size={15} />
        </button>
    )
}

export const PaginationEllipsis = ({
    className,
    ...props
}: React.ComponentProps<'span'>) => {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn("", className)}
            {...props}
        >
            <Ellipsis size={17} className="mx-1 text-gray-400" />
            <span className="sr-only">More pages</span>
        </span>
    )
}


type PaginationPageNumberProps =
    React.ComponentProps<'span'> & {
        page: number
    }
export const PaginationPageNumber = ({
    className,
    page,
    ...props
}: PaginationPageNumberProps) => {
    return (
        <span
            aria-current="page"
            className={cn("flex h-9 w-9 items-center justify-center rounded-md",
                "border border-gray-300 bg-gray-100 text-sm font-medium", className)}
            {...props}
        >
            {page}
        </span>
    )
}
