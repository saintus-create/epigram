"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

interface FadeInProps extends HTMLMotionProps<"div"> {
    duration?: number
    delay?: number
}

export function FadeIn({ children, duration = 0.5, delay = 0, className, ...props }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
