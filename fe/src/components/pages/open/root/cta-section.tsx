import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { routing } from "@/i18n/routing";
import RootSection from "./section";

export function CtaSection() {
  const t = useTranslations("pages.root.cta");

  return (
    <RootSection>
      <div className="mx-auto max-w-4xl rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
        <h2 className="mb-4 text-4xl font-bold">{t("title")}</h2>
        <p className="mb-8 text-lg opacity-90">{t("description")}</p>
        <div className="flex flex-col items-center gap-4">
          <Button size="lg" variant="secondary" className="gap-2" asChild>
            <Link href={routing.pathnames["/dashboard"]}>
              {t("button")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="text-sm opacity-75">{t("features")}</div>
        </div>
      </div>
    </RootSection>
  );
}
