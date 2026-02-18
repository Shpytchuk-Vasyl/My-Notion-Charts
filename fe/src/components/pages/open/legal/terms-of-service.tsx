import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function TermsOfService() {
  const t = useTranslations("pages.legal.termsOfService");
  const sections = t.raw("sections") as Array<{
    title: string;
    content: string;
  }>;

  return (
    <>
      <h1 className="mb-4 text-4xl font-bold">{t("title")}</h1>
      <p className="text-sm text-secondary-foreground mb-12">
        {t("lastUpdated")}
      </p>

      <Accordion type="multiple">
        {sections.map((section, index) => (
          <AccordionItem
            key={`term-of-service-item-${index}`}
            value={`item-${index}`}
          >
            <AccordionTrigger>{section.title}</AccordionTrigger>
            <AccordionContent asChild>
              <p className="text-secondary-foreground">{section.content}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
