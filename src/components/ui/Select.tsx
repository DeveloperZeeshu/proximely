import { cn } from "@/src/lib/utils"
import { X } from "lucide-react"
import React, { useId } from "react"
import type { FieldError } from "react-hook-form"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    options?: string[]
    className?: string
    errors?: FieldError
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
    label = '',
    options,
    className = '',
    errors,
    ...props
}, ref) => {
    const id = useId()
    return (
        <div className="flex flex-col w-full">
            <label
                htmlFor={id}
                className="text-sm">
                {label}
            </label>

            <select
                id={id}
                className={cn(
                    "w-full rounded-lg border border-gray-300 bg-background px-2 py-2 text-sm placeholder:text-muted-foreground transition-[box-shadow,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    !errors &&
                    "focus:border-blue-400 focus:ring-3 focus:ring-blue-500/20",
                    errors &&
                    "border-red-500 ring-3 ring-red-500/30 focus:border-red-500 focus:ring-red-500/30",

                    className
                )}
                {...props}
                ref={ref}>
                {
                    options?.map(option => (
                        <option
                            key={option}
                            value={option}>
                            {option}
                        </option>
                    ))
                }
            </select>

            {errors && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-700">
                    <X size={17} color="#fd0808" /> <span>{errors.message}</span>
                </div>
            )}
        </div>
    )
})

export default Select


