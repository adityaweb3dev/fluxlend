import React from "react";
import { BeamsBackground } from "@/components/ui/beams-background"

export function BeamsBackgroundDemo() {
    return (
        <BeamsBackground className="h-[400px]">
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Powerful Backend</h2>
                <p className="max-w-md text-white/70">
                    Propelled by secure smart contracts and institutional-grade liquidity.
                </p>
            </div>
        </BeamsBackground>
    )
}
