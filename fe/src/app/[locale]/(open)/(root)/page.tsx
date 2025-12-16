import { CtaSection } from "@/components/pages/open/root/cta-section";
import { FeatureCardsSection } from "@/components/pages/open/root/feature-cards-section";
import { FeaturesGridSection } from "@/components/pages/open/root/features-grid-section";
import { Footer } from "@/components/pages/open/root/footer";
import { HeroSection } from "@/components/pages/open/root/hero-section";
import { HowItWorksSection } from "@/components/pages/open/root/how-it-works-section";

export { generateStaticParams } from "@/i18n/static-params";

export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesGridSection />
      <FeatureCardsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
