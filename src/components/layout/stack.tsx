import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const stackVariants = cva(
    "flex",
    {
        variants: {
            direction: {
                row: "flex-row",
                column: "flex-col",
                "row-reverse": "flex-row-reverse",
                "col-reverse": "flex-col-reverse",
            },
            align: {
                start: "items-start",
                center: "items-center",
                end: "items-end",
                stretch: "items-stretch",
                baseline: "items-baseline",
            },
            justify: {
                start: "justify-start",
                center: "justify-center",
                end: "justify-end",
                between: "justify-between",
                around: "justify-around",
            },
            gap: {
                none: "gap-0",
                xs: "gap-2",
                sm: "gap-4",
                md: "gap-6",
                lg: "gap-8",
                xl: "gap-12",
            },
            wrap: {
                nowrap: "flex-nowrap",
                wrap: "flex-wrap",
            }
        },
        defaultVariants: {
            direction: "column",
            align: "stretch",
            justify: "start",
            gap: "sm",
            wrap: "nowrap",
        },
    }
)

export interface StackProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
    as?: React.ElementType
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
    ({ className, direction, align, justify, gap, wrap, as: Component = "div", ...props }, ref) => {
        return (
            <Component
                className={cn(stackVariants({ direction, align, justify, gap, wrap, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Stack.displayName = "Stack"

export { Stack, stackVariants }
