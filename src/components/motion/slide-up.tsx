"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

interface SlideUpProps extends HTMLMotionProps<"div"> {
    duration?: number
    delay?: number
    offset?: number
}

export function SlideUp({ children, duration = 0.5, delay = 0, offset = 20, className, ...props }: SlideUpProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: offset }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}
