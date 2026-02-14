import { AppHeader } from "@/pages/protected/general/header";
import { useTranslations } from "next-intl";

export default function Page() {
  const messages = useTranslations("nav.header");
  return (
    <AppHeader
      translations={{
        dashboard: messages("dashboard"),
      }}
    />
  );
}
