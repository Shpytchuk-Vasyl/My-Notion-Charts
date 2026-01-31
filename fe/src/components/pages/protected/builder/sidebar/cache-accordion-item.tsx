import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBuilderContext } from "../context";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock1, Clock6,  Clock12, ClockAlert, ClockCheck, Watch } from "lucide-react";

const availableCacheDurations = [
  { name: "without", value: 0, icon: <ClockAlert /> },
  { name: "tenMin", value: 10 * 60, icon: <Watch /> },
  { name: "oneHour", value: 60 * 60, icon: <Clock1 /> },
  { name: "sixHours", value: 6 * 60 * 60, icon: <Clock6 /> },
  { name: "twelveHours", value: 12 * 60 * 60, icon: <Clock12 /> },
  { name: "oneDay", value: 24 * 60 * 60, icon: <ClockCheck /> },
];

export const CacheAccordionItem = () => {
  const { isLoading, cacheDuration, setCacheDuration } = useBuilderContext();

  return (
    <AccordionItem value="chart-cache">
      <AccordionTrigger>Кешування</AccordionTrigger>
      <AccordionContent>
        <Field className="px-2">
          <FieldLabel htmlFor="cacheDuration">Тривалість кешування:</FieldLabel>

          {isLoading && <Skeleton className="h-9 w-full" />}

          {!isLoading && (
            <Select
              value={cacheDuration as unknown as string}
              onValueChange={
                setCacheDuration as unknown as (value: string) => void
              }
            >
              <SelectTrigger id="cacheDuration" className="w-full">
                <SelectValue placeholder="Виберіть тривалість кешування" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {availableCacheDurations.map(({ name, value, icon }) => (
                    <SelectItem
                      key={`cache-duration-field-${name}`}
                      value={value as unknown as string}
                    >
                      {icon}
                      {name}
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
