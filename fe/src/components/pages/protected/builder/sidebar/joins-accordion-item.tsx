import { useTranslations } from "next-intl";
import { PropertyIcon } from "@/components/block/notion/property";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBuilderContext } from "../context";
import { cn } from "@/lib/utils";

export const JoinsAccordionItem = () => {
  const t = useTranslations("pages.chart.edit.nav");
  const { isLoading, availableJoins, joins, onChangeJoin } =
    useBuilderContext();

  if (isLoading || availableJoins.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="chart-joins">
      <AccordionTrigger>{t("joins.title")}</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          {availableJoins.map((join, index) => (
            <div
              className={cn(
                "grid gap-2 grid-cols-2",
                joins[index].to &&
                  !joins[index].to.includes("::") &&
                  "grid-cols-1",
              )}
              key={`join-grid-item-${join.name}`}
            >
              <Field>
                <FieldLabel
                  className="truncate"
                  htmlFor={`join${join.name}From`}
                >
                  {join.name}:
                </FieldLabel>
                <Select
                  value={joins?.[index]?.from}
                  onValueChange={(value) => {
                    if (joins[index].to && !joins[index].to.includes("::")) {
                      onChangeJoin(index, value, null);
                    } else if (
                      join.from.find(
                        (option) =>
                          option.value === value &&
                          option.type === "relation" &&
                          (option as any).relation?.data_source_id === join.id,
                      )
                    ) {
                      onChangeJoin(index, value, join.id);
                    } else {
                      onChangeJoin(index, value);
                    }
                  }}
                >
                  <SelectTrigger id={`join${join.name}From`} className="w-full">
                    <SelectValue placeholder={t("property")} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {join.from.map(({ value, name, type }) => (
                        <SelectItem
                          key={`join-${join.name}-from-${value}`}
                          value={value}
                        >
                          <PropertyIcon type={type as any} />
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field
                className={cn(
                  joins[index].to && !joins[index].to.includes("::")
                    ? "hidden"
                    : "",
                )}
              >
                <FieldLabel
                  className="opacity-0"
                  htmlFor={`join${join.name}To`}
                >
                  -
                </FieldLabel>
                <Select
                  value={joins?.[index]?.to}
                  onValueChange={(value) =>
                    onChangeJoin(index, undefined, value)
                  }
                >
                  <SelectTrigger
                    id={`join${join.name}To`}
                    className="w-full relative before:content-['-'] before:absolute before:-left-1.75"
                  >
                    <SelectValue placeholder={t("property")} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {join.to.map(({ value, name, type }) => (
                        <SelectItem
                          key={`join-${join.name}-to-${value}`}
                          value={value}
                        >
                          <PropertyIcon type={type as any} />
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          ))}
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
