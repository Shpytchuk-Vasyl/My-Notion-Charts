"use client";

import { useTranslations } from "next-intl";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBuilderContext } from "../context";

export const LimitAccordionItem = () => {
  const t = useTranslations("pages.chart.edit.nav.limit");
  const { limit, setLimit, isLoading } = useBuilderContext();

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const raw = event.target.value.trim();

    if (!raw) {
      setLimit(undefined);
      return;
    }

    const value = Number(raw);
    if (!Number.isNaN(value) && value >= 0) {
      setLimit(value);
    }
  };

  return (
    <AccordionItem value="chart-limit">
      <AccordionTrigger>{t("title")}</AccordionTrigger>
      <AccordionContent asChild>
        <Field className="px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <FieldLabel htmlFor="chartLimit" className="w-fit!">
                {t("dataLimit")}:
              </FieldLabel>
            </TooltipTrigger>
            <TooltipContent side="right">
              {t("dataLimitTooltip")}
            </TooltipContent>
          </Tooltip>

          {isLoading && <Skeleton className="h-9 w-full" />}

          {!isLoading && (
            <Input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              min={0}
              defaultValue={limit ?? ""}
              onBlur={handleBlur}
              placeholder={t("dataLimitPlaceholder")}
              id="chartLimit"
            />
          )}
        </Field>
      </AccordionContent>
    </AccordionItem>
  );
};
