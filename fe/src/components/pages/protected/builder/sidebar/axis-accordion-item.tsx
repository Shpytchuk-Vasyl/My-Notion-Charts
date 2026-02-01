import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { PropertyIcon } from "@/components/block/notion/property";
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
import { useBuilderContext } from "../context";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

export const AxisAccordionItem = () => {
  const t = useTranslations("pages.chart.edit.nav");
  const {
    axisX,
    setAxisX,
    axisY,
    setAxisY,
    addAxisY,
    removeAxisY,
    isLoading,
    availableAxisProperties,
  } = useBuilderContext();

  return (
    <AccordionItem value="chart-axis">
      <AccordionTrigger>{t("axis.title")}</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          <Field>
            <FieldLabel htmlFor="axisX">{t("axis.axisX")}:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select value={axisX} onValueChange={setAxisX}>
                <SelectTrigger id="axisX" className="w-full">
                  <SelectValue placeholder={t("selectProperty")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {availableAxisProperties.map(({ name, value, type }) => (
                      <SelectItem
                        key={`axis-x-property-${value}`}
                        value={value}
                      >
                        <PropertyIcon type={type as any} />
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Field>

          {axisY.map((axis, index) => (
            <Field key={`axis-y-field-${index}`}>
              <FieldLabel htmlFor={`axisY-${index}`}>
                {t("axis.axisY")}:
              </FieldLabel>

              {isLoading && <Skeleton className="h-9 w-full" />}

              {!isLoading && (
                <ButtonGroup className="inline-flex">
                  <Select
                    value={axis.property}
                    onValueChange={(value) =>
                      setAxisY(index, value, axis.aggregation)
                    }
                  >
                    <SelectTrigger
                      id={`axisY-${index}`}
                      className="w-full truncate"
                    >
                      <SelectValue placeholder={t("selectProperty")} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {availableAxisProperties.map(
                          ({ name, value, type }) => (
                            <SelectItem
                              key={`axis-y-property-${value}-${index}`}
                              value={value}
                            >
                              <PropertyIcon type={type as any} />
                              {name}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => removeAxisY(index)}>
                    <Trash2 className="text-destructive" />
                  </Button>
                </ButtonGroup>
              )}
            </Field>
          ))}

          <Button variant="outline" onClick={addAxisY} disabled={isLoading}>
            <Plus />
            {t("axis.addAxisY")}
          </Button>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
