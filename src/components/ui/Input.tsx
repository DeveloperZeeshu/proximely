import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import React, { useId } from "react"
import type { FieldError } from "react-hook-form"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    type?: string
    placeholder?: string
    errors?: FieldError
    className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    label = '',
    type = 'text',
    placeholder = '',
    errors,
    className,
    ...props
}, ref) => {
    const id = useId()
    return (
        <div className="w-full text-sm">
            {label && (
                <>
                    <label
                        htmlFor={id}
                        className=" mb-6">
                        {label}
                    </label>
                </>
            )}

            <input
                type={type}
                id={id}
                className={cn(
                    "w-full rounded-lg border border-gray-300 bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground transition-[box-shadow,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    !errors &&
                    "focus:border-blue-400 focus:ring-3 focus:ring-blue-500/20",
                    errors &&
                    "border-red-500 ring-3 ring-red-500/30 focus:border-red-500 focus:ring-red-500/30",

                    className
                )}
                placeholder={placeholder}
                ref={ref}
                {...props}
            />

            {errors && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-700">
                    <X size={17} color="#fd0808" /> <span>{errors.message}</span>
                </div>
            )}

        </div>
    )
})

export default Input
