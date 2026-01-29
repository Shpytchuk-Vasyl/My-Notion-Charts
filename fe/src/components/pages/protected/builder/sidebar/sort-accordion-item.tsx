import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PropertyIcon } from "@/components/block/notion/property";
import { useBuilderContext } from "../context";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

export const SortAccordionItem = () => {
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
      <AccordionTrigger>Сортування</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          <Field>
            <FieldLabel htmlFor="sortProperty">Сортувати за:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select
                value={sortProperty}
                onValueChange={setSortProperty}
                key={sortProperty ? `sortProperty` : "sortPropertyNone"}
              >
                <SelectTrigger id="sortProperty" className="w-full">
                  <SelectValue placeholder="Виберіть властивість сортування" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {availableSortProperties.map(({ value, name, type }) => (
                      <SelectItem
                        key={`sort-property-field-${value}`}
                        value={value}
                      >
                          <PropertyIcon type={type as any} className="h-4 w-4" />
                          {name}
                      </SelectItem>
                    ))}
                    {sortProperty && (
                      <SelectItem key="sort-property-none" value="none">
                        Без сортування
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Field>
          <Field orientation="horizontal">
            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Checkbox
                id="sortAscending"
                checked={sortAscending}
                onCheckedChange={toggleSortAscending}
                disabled={!sortProperty}
              />
            )}
            <FieldLabel htmlFor="sortAscending">
              Сотувати за спаданням?
            </FieldLabel>
          </Field>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
