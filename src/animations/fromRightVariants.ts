import type { Variants } from "motion";

export const fromRightVariants: Variants = {
    hidden: {
        opacity: 0,
        transform: 'translateX(30px)'
    },
    show: {
        opacity: 1,
        transform: 'translateX(0px)',
        transition: {
            duration: .5
        }
    }
}

