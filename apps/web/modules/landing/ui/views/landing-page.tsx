"use client";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { ProcessDemo } from "../components/process-demo";
import { InteractiveDemo } from "../components/interactive-demo";
import { CallToAction } from "../components/call-to-action";
import { Footer } from "../components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <ProcessDemo />
      <InteractiveDemo />
      <CallToAction />
      <Footer />
    </div>
  );
}