import {
  Clock1,
  Clock6,
  Clock12,
  ClockAlert,
  ClockCheck,
  Watch,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldLabel } from "@/components/ui/field";
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

const availableCacheDurations = [
  { name: "without", value: 0, icon: <ClockAlert /> },
  { name: "tenMin", value: 10 * 60, icon: <Watch /> },
  { name: "oneHour", value: 60 * 60, icon: <Clock1 /> },
  { name: "sixHours", value: 6 * 60 * 60, icon: <Clock6 /> },
  { name: "twelveHours", value: 12 * 60 * 60, icon: <Clock12 /> },
  { name: "oneDay", value: 24 * 60 * 60, icon: <ClockCheck /> },
];

export const CacheAccordionItem = () => {
  const t = useTranslations("pages.chart.edit.nav.cache");
  const { isLoading, cacheDuration, setCacheDuration } = useBuilderContext();

  return (
    <AccordionItem value="chart-cache">
      <AccordionTrigger>{t("title")}</AccordionTrigger>
      <AccordionContent>
        <Field className="px-2">
          <FieldLabel htmlFor="cacheDuration">{t("duration")}:</FieldLabel>

          {isLoading && <Skeleton className="h-9 w-full" />}

          {!isLoading && (
            <Select
              value={cacheDuration as unknown as string}
              onValueChange={
                setCacheDuration as unknown as (value: string) => void
              }
            >
              <SelectTrigger id="cacheDuration" className="w-full">
                <SelectValue placeholder={t("durationPlaceholder")} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {availableCacheDurations.map(({ name, value, icon }) => (
                    <SelectItem
                      key={`cache-duration-field-${name}`}
                      value={value as unknown as string}
                    >
                      {icon}
                      {t(`durations.${name}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </Field>
      </AccordionContent>
    </AccordionItem>
  );
};
