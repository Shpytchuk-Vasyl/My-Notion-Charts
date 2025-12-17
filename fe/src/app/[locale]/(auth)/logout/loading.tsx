import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

export { generateStaticParams } from "@/i18n/static-params";

export const dynamic = "force-static";

export default function LogoutPage() {
  const t = useTranslations("pages.logout");

  return (
    <FieldGroup className="p-6 md:p-8 flex flex-col items-center justify-center gap-6 text-center min-h-[400px]">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-balance max-w-md">
          {t("description")}
        </p>
      </div>

      <Spinner />
    </FieldGroup>
  );
}
