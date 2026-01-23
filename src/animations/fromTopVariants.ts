import type { Variants } from "motion";

export const fromTopVariants: Variants = {
    hidden: {
        opacity: 0,
        y: -30,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};
