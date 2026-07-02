import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRightIcon,
  StarIcon,
  CircleCheckBigIcon,
  SparklesIcon,
  ClipboardListIcon,
  HeartIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "PantryPal — Turn Ingredients into Recipes with AI",
  description:
    "PantryPal uses AI to generate custom recipes from whatever you have on hand. List your ingredients and get cooking.",
  openGraph: {
    title: "PantryPal",
    description: "Turn your ingredients into delicious recipes with AI.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-foreground"
            >
              <path d="M12 2v4" />
              <path d="m16.2 7.8 2.8-2.8" />
              <path d="M20 12h4" />
              <path d="m16.2 16.2 2.8 2.8" />
              <path d="M12 20v2" />
              <path d="m7.8 16.2-2.8 2.8" />
              <path d="M2 12h2" />
              <path d="m7.8 7.8-2.8-2.8" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            PantryPal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            render={<Link href="/dashboard" />}
            nativeButton={false}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero */}
      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-24 text-center overflow-hidden">
        {/* Subtle SaaS Grid Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 size-96 bg-primary/20 rounded-full blur-3xl opacity-50" />

        <Badge
          variant="outline"
          className="mb-8 px-4 py-1.5 text-xs gap-2 rounded-full border-primary/20 bg-primary/5 text-primary font-medium"
        >
          <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
          Powered by Gemini 2.5 Flash
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
          Turn your ingredients into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
            delicious recipes
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          PantryPal uses AI to generate custom recipes from whatever you have on
          hand. Just list your ingredients and get cooking.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            render={<Link href="/dashboard" />}
            nativeButton={false}
            className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            Start Cooking
            <ArrowRightIcon className="ml-2 size-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            render={<Link href="/login" />}
            nativeButton={false}
            className="h-12 px-8 text-base"
          >
            Sign in
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <StarIcon className="size-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">500+ recipes generated</span>
          </div>
          <div className="flex items-center gap-2">
            <CircleCheckBigIcon className="size-4 text-green-500" />
            <span className="font-medium">Fast & Easy</span>
          </div>
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" />
            <span className="font-medium">AI-Powered</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to your next meal
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="relative pt-12 overflow-visible">
            <div className="absolute -top-4 -left-4 size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
              1
            </div>
            <CardContent className="text-center">
              <div className="size-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <ClipboardListIcon className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">
                List your ingredients
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Tell PantryPal what you have in your fridge, pantry, or
                cupboard.
              </p>
            </CardContent>
          </Card>

          <Card className="relative pt-12 overflow-visible">
            <div className="absolute -top-4 -left-4 size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
              2
            </div>
            <CardContent className="text-center">
              <div className="size-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">
                AI generates recipes
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Get custom recipes tailored to your ingredients in seconds.
              </p>
            </CardContent>
          </Card>

          <Card className="relative pt-12 overflow-visible">
            <div className="absolute -top-4 -left-4 size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
              3
            </div>
            <CardContent className="text-center">
              <div className="size-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="size-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">
                Cook & save favorites
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Save your favorite recipes and revisit them anytime.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-primary rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight mb-4">
            Ready to cook something amazing?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join hundreds of home cooks using AI to turn their ingredients into
            delicious meals.
          </p>
          <Button
            variant="secondary"
            size="lg"
            render={<Link href="/dashboard" />}
            nativeButton={false}
          >
            Get Started Free
            <ArrowRightIcon />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          PantryPal — AI-powered recipe generation
        </p>
      </footer>
    </div>
  );
}
