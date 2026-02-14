import { CtaSection } from "@/pages/open/root/cta-section";
import { FeatureCardsSection } from "@/pages/open/root/feature-cards-section";
import { FeaturesGridSection } from "@/pages/open/root/features-grid-section";
import { Footer } from "@/pages/open/root/footer";
import { HeroSection } from "@/pages/open/root/hero-section";
import { HowItWorksSection } from "@/pages/open/root/how-it-works-section";

export { generateStaticParams } from "@/i18n/static-params";


export default function Page() {
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
