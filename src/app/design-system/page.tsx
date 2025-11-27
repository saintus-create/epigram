"use client"

import { Box } from "@/components/layout/box"
import { Stack } from "@/components/layout/stack"
import { Grid } from "@/components/layout/grid"
import { Container } from "@/components/layout/container"
import { FadeIn } from "@/components/motion/fade-in"
import { SlideUp } from "@/components/motion/slide-up"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DesignSystemPage() {
    return (
        <Container size="xl" className="py-12">
            <Stack gap="xl">
                <FadeIn>
                    <Box className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Design System Primitives</h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            A showcase of the foundational layout and motion components that enforce visual principles like proximity, alignment, and hierarchy.
                        </p>
                    </Box>
                </FadeIn>

                <SlideUp delay={0.2}>
                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Layout Primitives</h2>
                        <Grid columns={3} gap="lg">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Box</CardTitle>
                                    <CardDescription>Base polymorphic container</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Box padding="md" background="muted" radius="md" border="default">
                                        I am a Box with padding, background, and border.
                                    </Box>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Stack</CardTitle>
                                    <CardDescription>Flexbox layout helper</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Stack gap="sm" align="center" className="bg-muted p-4 rounded-md">
                                        <Badge>Item 1</Badge>
                                        <Badge variant="secondary">Item 2</Badge>
                                        <Badge variant="outline">Item 3</Badge>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Grid</CardTitle>
                                    <CardDescription>CSS Grid layout helper</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Grid columns={2} gap="xs" className="bg-muted p-4 rounded-md">
                                        <Box background="primary" className="h-12 w-full rounded-sm opacity-80" />
                                        <Box background="primary" className="h-12 w-full rounded-sm opacity-60" />
                                        <Box background="primary" className="h-12 w-full rounded-sm opacity-40" />
                                        <Box background="primary" className="h-12 w-full rounded-sm opacity-20" />
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </section>
                </SlideUp>

                <SlideUp delay={0.4}>
                    <section>
                        <h2 className="text-2xl font-semibold mb-6">Visual Principles in Action</h2>
                        <Grid columns={2} gap="lg">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Proximity & Hierarchy</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Stack gap="md">
                                        <Box>
                                            <h3 className="text-lg font-medium">Grouped Content</h3>
                                            <p className="text-sm text-muted-foreground">Related items are spaced closely.</p>
                                        </Box>
                                        <Stack direction="row" gap="sm">
                                            <Button size="sm">Action</Button>
                                            <Button size="sm" variant="ghost">Cancel</Button>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Motion & Feedback</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Stack gap="md">
                                        <FadeIn duration={1} key={Math.random()}>
                                            <Box padding="sm" background="secondary" radius="md" className="text-center">
                                                Fade In Animation
                                            </Box>
                                        </FadeIn>
                                        <SlideUp offset={10} duration={0.5} key={Math.random()}>
                                            <Box padding="sm" border="default" radius="md" className="text-center">
                                                Slide Up Animation
                                            </Box>
                                        </SlideUp>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </section>
                </SlideUp>
            </Stack>
        </Container>
    )
}
