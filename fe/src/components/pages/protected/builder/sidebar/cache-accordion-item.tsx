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

export const CacheAccordionItem = () => {
  const {
    isLoading,
    cacheDuration,
    availableCacheDurations,
    setCacheDuration,
  } = useBuilderContext();

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
                  {availableCacheDurations.map(({ name, value }) => (
                    <SelectItem
                      key={`cache-duration-field-${name}`}
                      value={value}
                    >
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
