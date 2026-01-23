import { cn } from "@/lib/utils"
import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string
    type?: 'button' | 'submit' | 'reset'
    className?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    type = 'button',
    text = 'Submit',
    className = '',
    ...props
}, ref) => {
    return <button
        className={cn("cursor-pointer text-white text-sm bg-blue-500 hover:bg-blue-600",
            "active:scale-95 transition py-2 px-4 rounded-lg flex justify-center items-center",
            className)}
        type={type}
        ref={ref}
        {...props}
    >
        {children || text}
    </button>
})


// Loading button
type LoadingButtonType = {
    bgColor?: string
    text?: string
    className?: string
}

export const LoadingButton = ({
    bgColor = 'bg-blue-500',
    text = 'Processing...',
    className
}: LoadingButtonType) => {
    return (
        <button
            type="button"
            disabled
            className={cn("inline-flex justify-center items-center gap-2 rounded-lg px-4 py-1.5",
                " text-white cursor-not-allowed opacity-70 w-full", bgColor, className)}
        >
            <div className="size-5 animate-spin rounded-full border-3 border-white border-t-transparent" />
            {text}
        </button>

    )
}

