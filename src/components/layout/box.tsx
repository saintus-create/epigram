import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const boxVariants = cva(
    "block",
    {
        variants: {
            padding: {
                none: "p-0",
                xs: "p-2",
                sm: "p-4",
                md: "p-6",
                lg: "p-8",
                xl: "p-12",
            },
            margin: {
                none: "m-0",
                xs: "m-2",
                sm: "m-4",
                md: "m-6",
                lg: "m-8",
                xl: "m-12",
            },
            background: {
                transparent: "bg-transparent",
                surface: "bg-background",
                card: "bg-card",
                muted: "bg-muted",
                primary: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
            },
            border: {
                none: "border-0",
                default: "border border-border",
            },
            radius: {
                none: "rounded-none",
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                full: "rounded-full",
            },
            shadow: {
                none: "shadow-none",
                sm: "shadow-sm",
                md: "shadow",
                lg: "shadow-lg",
            }
        },
        defaultVariants: {
            padding: "none",
            margin: "none",
            background: "transparent",
            border: "none",
            radius: "none",
            shadow: "none",
        },
    }
)

export interface BoxProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {
    as?: React.ElementType
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
    ({ className, padding, margin, background, border, radius, shadow, as: Component = "div", ...props }, ref) => {
        return (
            <Component
                className={cn(boxVariants({ padding, margin, background, border, radius, shadow, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Box.displayName = "Box"

export { Box, boxVariants }
