import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, routing } from "@/i18n/routing";
import RootSection from "./section";

export function HeroSection() {
  const t = useTranslations("pages.root.hero");

  return (
    <RootSection>
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
          {t("title")}{" "}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("titleHighlight")}
          </span>
        </h1>

        <p className="mb-10 text-lg text-gray-600 md:text-xl">
          {t("description")}
        </p>

        <Button size="lg" className="gap-2 mx-auto" asChild variant="outline">
          <Link href={routing.pathnames["/dashboard"]}>
            {t("cta")} <ArrowRightIcon />
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      <Card className="mx-auto mt-16 max-w-6xl px-6">
        <Image
          src="/images/hero-chart-example.png"
          alt={t("imageAlt")}
          width={1200}
          height={800}
          className="w-full h-auto"
        />
      </Card>
    </RootSection>
  );
}
