
import React, { useId, type TextareaHTMLAttributes } from "react"

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    className?: string
    placeholder?: string
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
    label = '',
    className = '',
    placeholder = '',
    ...props
}, ref) => {
    const id = useId()
    return (
        <div className="flex flex-col">
            <label
                htmlFor={id}
                className="text-[1.5rem] lg:text-3xl">
                {label}
            </label>

            <textarea
                className={`bg-[#282828] text-[1.6rem] w-full rounded-xl px-1 py-1 h-auto resize-none  mt-3 pb-2 ${className}`}
                placeholder={placeholder}
                id={id}
                ref={ref}
                {...props}
            />
        </div>
    )
})

export default TextArea



