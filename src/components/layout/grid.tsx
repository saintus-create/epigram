import { memo, forwardRef, useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import type { ElementType, ReactNode } from "react";

// ---- Variant Definition: Single source of truth ----
// Responsive variants use the container query syntax for true isolation
const gridVariants = cva("grid", {
    variants: {
        // Base columns (mobile-first, because 2027 remembers progressive enhancement)
        columns: {
            0: "grid-cols-none",
            1: "grid-cols-1",
            2: "grid-cols-2",
            3: "grid-cols-3",
            4: "grid-cols-4",
            5: "grid-cols-5",
            6: "grid-cols-6",
            8: "grid-cols-8",
            10: "grid-cols-10",
            12: "grid-cols-12",
        },
        // Responsive columns: uses @container for component-level responsiveness
        smColumns: {
            1: "@sm:grid-cols-1",
            2: "@sm:grid-cols-2",
            3: "@sm:grid-cols-3",
            4: "@sm:grid-cols-4",
            6: "@sm:grid-cols-6",
        },
        mdColumns: {
            1: "@md:grid-cols-1",
            2: "@md:grid-cols-2",
            3: "@md:grid-cols-3",
            4: "@md:grid-cols-4",
            6: "@md:grid-cols-6",
            8: "@md:grid-cols-8",
        },
        lgColumns: {
            1: "@lg:grid-cols-1",
            2: "@lg:grid-cols-2",
            3: "@lg:grid-cols-3",
            4: "@lg:grid-cols-4",
            6: "@lg:grid-cols-6",
            8: "@lg:grid-cols-8",
            10: "@lg:grid-cols-10",
            12: "@lg:grid-cols-12",
        },
        // Gap: uses CSS variables for theme consistency
        gap: {
            none: "gap-[var(--space-0)]",
            xs: "gap-[var(--space-2)]",
            sm: "gap-[var(--space-4)]",
            md: "gap-[var(--space-6)]",
            lg: "gap-[var(--space-8)]",
            xl: "gap-[var(--space-12)]",
        },
        // Auto-flow variants for dense packing
        flow: {
            row: "grid-flow-row",
            col: "grid-flow-col",
            dense: "grid-flow-dense",
        },
        // Place items: single property for align + justify
        placeItems: {
            start: "place-items-start",
            center: "place-items-center",
            end: "place-items-end",
            stretch: "place-items-stretch",
        },
        // Alignment axis controls
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
            evenly: "justify-evenly",
        },
    },
    // Compound variants: Logic that prevents invalid combinations
    compoundVariants: [
        // If columns=0 (grid disabled), force gap to none
        { columns: 0, gap: ["xs", "sm", "md", "lg", "xl"], class: "gap-[var(--space-0)]" },
    ],
    // In 2027, defaultVariants is undefined for maximum composition flexibility
    defaultVariants: {},
});

// ---- Props Interface: Explicit and documented ----
export interface GridProps extends VariantProps<typeof gridVariants> {
    /** The content to render inside the grid */
    children: ReactNode;
    /** CSS class name for additional styling */
    className?: string;
    /** The component to render as (polymorphic) */
    as?: ElementType;
    /** ARIA role for accessibility */
    role?: string;
    /** ARIA label for screen readers */
    "aria-label"?: string;
    /** ID for testing and accessibility */
    id?: string;
}

// ---- Component: Memoized, accessible, and ref-forwarded ----
/**
 * Grid
 * @description A responsive CSS Grid component with advanced layout capabilities
 * @example
 * // Basic responsive grid
 * <Grid columns={1} mdColumns={3} gap="md">
 *   <GridItem>Content 1</GridItem>
 *   <GridItem>Content 2</GridItem>
 * </Grid>
 * 
 * @example
 * // Dense packing for masonry-style layout
 * <Grid columns={2} flow="dense" gap="sm">
 *   <GridItem className="col-span-2">Full width</GridItem>
 *   <GridItem>Half width</GridItem>
 * </Grid>
 */
const Grid = memo(
    forwardRef<HTMLDivElement, GridProps>(({
        children,
        className,
        as: Component = "div",
        columns,
        smColumns,
        mdColumns,
        lgColumns,
        gap,
        flow,
        placeItems,
        align,
        justify,
        role = "grid",
        "aria-label": ariaLabel,
        id,
        ...props
    }, ref) => {
        const gridId = useId();
        const uniqueId = id || `grid - ${gridId} `;

        return (
            <Component
                id={uniqueId}
                ref={ref}
                className={cn(
                    gridVariants({
                        columns,
                        smColumns,
                        mdColumns,
                        lgColumns,
                        gap,
                        flow,
                        placeItems,
                        align,
                        justify,
                    }),
                    className
                )}
                role={role}
                aria-label={ariaLabel}
                {...props}
            >
                {children}
            </Component>
        );
    })
);

Grid.displayName = "Grid";

export { Grid, gridVariants };