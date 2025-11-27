import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva(
    "mx-auto w-full px-4 md:px-6 lg:px-8",
    {
        variants: {
            size: {
                sm: "max-w-screen-sm",
                md: "max-w-screen-md",
                lg: "max-w-screen-lg",
                xl: "max-w-screen-xl",
                "2xl": "max-w-screen-2xl",
                full: "max-w-full",
            },
        },
        defaultVariants: {
            size: "xl",
        },
    }
)

export interface ContainerProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
    as?: React.ElementType
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, size, as: Component = "div", ...props }, ref) => {
        return (
            <Component
                className={cn(containerVariants({ size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Container.displayName = "Container"

export { Container, containerVariants }
