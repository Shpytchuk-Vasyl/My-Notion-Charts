import { PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { PropertyIcon } from "@/components/block/notion/property";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
      <AccordionTrigger
        data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.AXIS_ACCORDION}
      >
        {t("axis.title")}
      </AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          <Field>
            <FieldLabel htmlFor="axisX">{t("axis.axisX")}:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select value={axisX} onValueChange={setAxisX}>
                <SelectTrigger
                  id="axisX"
                  className="w-full"
                  data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.AXIS_X}
                >
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
                      data-tour-step-id={`${TOUR_FIRST_EDIT_CHART_IDS.AXIS_Y}-${index}`}
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
                  <Button
                    variant="outline"
                    onClick={() => removeAxisY(index)}
                    data-tour-step-id={`${TOUR_FIRST_EDIT_CHART_IDS.AXIS_REMOVE}-${index}`}
                  >
                    <Trash2Icon className="text-destructive" />
                  </Button>
                </ButtonGroup>
              )}
            </Field>
          ))}

          <Button
            variant="outline"
            onClick={addAxisY}
            disabled={isLoading}
            data-tour-step-id={TOUR_FIRST_EDIT_CHART_IDS.AXIS_ADD}
          >
            <PlusIcon />
            {t("axis.addAxisY")}
          </Button>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
