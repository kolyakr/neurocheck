"use client";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_2px,transparent_2px),radial-gradient(circle_at_80%_30%,white_2px,transparent_2px),radial-gradient(circle_at_40%_80%,white_2px,transparent_2px)] [background-size:18px_18px,22px_22px,26px_26px] [background-position:0_0,10px_10px,20px_20px]" />

      <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Neurocheck — smarter insights for neurological health
          </h1>
          <p className="mt-4 text-white/90 text-lg sm:text-xl">
            Enter your symptoms and get a machine‑learning powered prediction.
            Your data stays private, your insights stay useful.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-700 hover:bg-white/90"
            >
              <Link href="/diagnosis">Start diagnosis</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-white/90 hover:bg-white/10"
            >
              <Link href="/history">View history</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-24 -bottom-24 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />
    </section>
  );
}
