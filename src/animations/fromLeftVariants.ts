import type { Variants } from "motion";

export const fromLeftVariants: Variants = {
    hidden: {
        opacity: 0,
        transform: "translateX(-30px)",
    },
    show: {
        opacity: 1,
        transform: "translateX(0px)",
        transition: {
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
        }
    }
}

