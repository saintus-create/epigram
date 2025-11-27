import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gridVariants = cva(
    "grid",
    {
        variants: {
            columns: {
                1: "grid-cols-1",
                2: "grid-cols-2",
                3: "grid-cols-3",
                4: "grid-cols-4",
                5: "grid-cols-5",
                6: "grid-cols-6",
                12: "grid-cols-12",
                none: "grid-cols-none",
            },
            gap: {
                none: "gap-0",
                xs: "gap-2",
                sm: "gap-4",
                md: "gap-6",
                lg: "gap-8",
                xl: "gap-12",
            },
            align: {
                start: "items-start",
                center: "items-center",
                end: "items-end",
                stretch: "items-stretch",
            },
            justify: {
                start: "justify-start",
                center: "justify-center",
                end: "justify-end",
                between: "justify-between",
            },
        },
        defaultVariants: {
            columns: 1,
            gap: "md",
            align: "stretch",
            justify: "start",
        },
    }
)

export interface GridProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
    as?: React.ElementType
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ className, columns, gap, align, justify, as: Component = "div", ...props }, ref) => {
        return (
            <Component
                className={cn(gridVariants({ columns, gap, align, justify, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Grid.displayName = "Grid"

export { Grid, gridVariants }
