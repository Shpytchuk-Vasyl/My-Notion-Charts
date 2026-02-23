import { Plus, SquarePen } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  FilterForm,
  FilterFormToString,
} from "@/components/block/notion/filter";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBuilderContext } from "../context";
import { TOUR_FIRST_EDIT_CHART_IDS } from "../tour";

export const FiltersAccordionItem = () => {
  const t = useTranslations("pages.chart.edit.nav.filters");
  const { filters, addFilterGroup, isLoading } = useBuilderContext();

  return (
    <AccordionItem value="chart-filters">
      <AccordionTrigger
        data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACCORDION}
      >
        {t("title")}
      </AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2 gap-2">
          <FieldLabel className="font-normal">
            {filters && FilterFormToString(filters)}
          </FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              {Object.keys((filters ?? {}) as any).length ? (
                <Button
                  variant="outline"
                  data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACTION}
                >
                  <SquarePen />
                  {t("editFilter")}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.FILTERS_ACTION}
                  onClick={() => addFilterGroup([])}
                  disabled={isLoading}
                >
                  <Plus />
                  {t("createFilter")}
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto space-y-2" align="start">
              {filters && <FilterForm group={filters} path={[]} />}
            </PopoverContent>
          </Popover>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
