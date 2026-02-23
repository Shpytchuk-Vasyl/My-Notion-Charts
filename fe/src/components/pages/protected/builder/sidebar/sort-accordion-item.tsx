import { useTranslations } from "next-intl";
import { PropertyIcon } from "@/components/block/notion/property";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuilderContext } from "../context";
import { TOUR_FIRST_EDIT_CHART_IDS } from "../tour";

export const SortAccordionItem = () => {
  const t = useTranslations("pages.chart.edit.nav.sort");
  const {
    sortAscending,
    availableSortProperties,
    sortProperty,
    toggleSortAscending,
    setSortProperty,
    isLoading,
  } = useBuilderContext();

  return (
    <AccordionItem value="chart-sort">
      <AccordionTrigger
        data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.SORT_ACCORDION}
      >
        {t("title")}
      </AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          <Field>
            <FieldLabel htmlFor="sortProperty">{t("sortBy")}:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select
                value={sortProperty}
                onValueChange={setSortProperty}
                key={sortProperty ? `sortProperty` : "sortPropertyNone"}
              >
                <SelectTrigger
                  id="sortProperty"
                  className="w-full"
                  data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.SORT_PROPERTY}
                >
                  <SelectValue placeholder={t("sortByPlaceholder")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {availableSortProperties.map(({ value, name, type }) => (
                      <SelectItem
                        key={`sort-property-field-${value}`}
                        value={value}
                      >
                        <PropertyIcon type={type as any} />
                        {name}
                      </SelectItem>
                    ))}
                    {sortProperty && (
                      <SelectItem key="sort-property-none" value="none">
                        {t("noSort")}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Field>
          <Field
            orientation="horizontal"
            data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.SORT_DIRECTION}
          >
            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Checkbox
                id="sortAscending"
                checked={sortAscending}
                onCheckedChange={toggleSortAscending}
                disabled={!sortProperty}
              />
            )}
            <FieldLabel htmlFor="sortAscending">{t("descending")}</FieldLabel>
          </Field>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
