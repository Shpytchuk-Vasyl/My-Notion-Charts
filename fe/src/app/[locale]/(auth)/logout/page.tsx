import { getTranslations } from "next-intl/server";
import { signOut } from "@/app/[locale]/(auth)/actions";
import { Spinner } from "@/components/ui/spinner";
import { FieldGroup } from "@/components/ui/field";

export default async function LogoutPage() {
  const t = await getTranslations("pages.logout");

  await signOut();

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
