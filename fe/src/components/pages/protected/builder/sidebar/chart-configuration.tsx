"use client";

import { Accordion } from "@/components/ui/accordion";
import { AxisAccordionItem } from "./axis-accordion-item";
import { CacheAccordionItem } from "./cache-accordion-item";
import { FiltersAccordionItem } from "./filters-accordion-item";
import { JoinsAccordionItem } from "./joins-accordion-item";
import { LimitAccordionItem } from "./limit-accordion-item";
import { SettingsAccordionItem } from "./settings-accordion-item";
import { SortAccordionItem } from "./sort-accordion-item";

export function ChartConfigurationAccordion() {
  console.log("Rendering ChartConfigurationAccordion");
  return (
    <Accordion className="px-4" type="multiple">
      <SettingsAccordionItem />

      <AxisAccordionItem />

      <CacheAccordionItem />

      <FiltersAccordionItem />

      <SortAccordionItem />

      <LimitAccordionItem />

      <JoinsAccordionItem />
    </Accordion>
  );
}
