"use client";

import { Accordion } from "@/components/ui/accordion";
import { AxisAccordionItem } from "./axis-accordion-item";
import { CacheAccordionItem } from "./cache-accordion-item";
import { FiltersAccordionItem } from "./filters-accordion-item";
import { JoinsAccordionItem } from "./joins-accordion-item";
import { LimitAccordionItem } from "./limit-accordion-item";
import { SettingsAccordionItem } from "./settings-accordion-item";
import { SortAccordionItem } from "./sort-accordion-item";
import { getTours, TOUR_FIRST_EDIT_CHART_IDS } from "../tour";
import { useTranslations } from "next-intl";
import { TourProvider } from "@/components/ui/tour";
import { FirstEditChartTour } from "./first-edit-tour";

export function ChartConfigurationAccordion() {
  const t = useTranslations("tours.nav");

  return (
    <TourProvider
      tours={getTours(useTranslations("tours.chart.edit"))}
      translations={{
        next: t("next"),
        previous: t("previous"),
        finish: t("finish"),
        step: t("step"),
        of: t("of"),
      }}
    >
      <Accordion
        className="px-4"
        type="multiple"
        data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.WELCOME}
      >
        <SettingsAccordionItem />

        <FiltersAccordionItem />

        <AxisAccordionItem />

        <CacheAccordionItem />

        <SortAccordionItem />

        <LimitAccordionItem />

        <JoinsAccordionItem />
      </Accordion>

      <FirstEditChartTour />
    </TourProvider>
  );
}
