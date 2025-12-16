import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("pages.root.footer");

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-sm text-gray-600">{t("copyright")}</p>
      </div>
    </footer>
  );
}
