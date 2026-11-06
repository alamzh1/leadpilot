import { Audience } from "@/components/sections/Audience";
import { Capabilities } from "@/components/sections/Capabilities";
import { Demo } from "@/components/sections/Demo";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Nav } from "@/components/sections/Nav";
import { Problem } from "@/components/sections/Problem";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Demo />
        <Problem />
        <HowItWorks />
        <Capabilities />
        <Audience />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
