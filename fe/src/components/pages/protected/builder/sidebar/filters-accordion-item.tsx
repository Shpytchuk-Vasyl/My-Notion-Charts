import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useBuilderContext } from "../context";
import { FieldGroup, FieldLabel } from "@/components/ui/field";

import { Button } from "@/components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FilterForm,
  FilterFormToString,
} from "@/components/block/notion/filter";

export const FiltersAccordionItem = () => {
  const { filters, addFilterGroup, isLoading } = useBuilderContext();

  return (
    <AccordionItem value="chart-filters">
      <AccordionTrigger>Фільтри</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2 gap-2">
          <FieldLabel className="font-normal">
            {filters && FilterFormToString(filters)}
          </FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              {Object.keys((filters ?? {}) as any).length ? (
                <Button variant="outline">
                  <SquarePen />
                  Редагувати фільтр
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => addFilterGroup([])}
                  disabled={isLoading}
                >
                  <Plus />
                  Створити фільтр
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
