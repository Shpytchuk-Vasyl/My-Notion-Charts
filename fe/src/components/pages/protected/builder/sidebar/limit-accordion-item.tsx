"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useBuilderContext } from "../context";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const LimitAccordionItem = () => {
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
      <AccordionTrigger>Ліміт</AccordionTrigger>
      <AccordionContent asChild>
        <Field className="px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <FieldLabel htmlFor="chartLimit" className="w-fit!">
                Ліміт даних:
              </FieldLabel>
            </TooltipTrigger>
            <TooltipContent side="right">
              Мається на увазі максимальна кількість рядків даних, які будуть
              відображені на графіку
            </TooltipContent>
          </Tooltip>

          {isLoading && <Skeleton className="h-9 w-full" />}

          {!isLoading && (
            <Input
              type="number"
              min={0}
              defaultValue={limit ?? ""}
              onBlur={handleBlur}
              placeholder="Без ліміту"
              id="chartLimit"
            />
          )}
        </Field>
      </AccordionContent>
    </AccordionItem>
  );
};
