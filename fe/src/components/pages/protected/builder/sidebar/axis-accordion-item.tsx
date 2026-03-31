import { PlusIcon, SettingsIcon, Trash2Icon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
                    onValueChange={(value) => setAxisY(index, value)}
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-tour-step-id={`${TOUR_FIRST_EDIT_CHART_IDS.AXIS_REMOVE}-${index}`}
                      >
                        <SettingsIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto space-y-2" align="start">
                      <ConvertSelect
                        conversion={axis.conversion}
                        setConversion={(conv) =>
                          setAxisY(index, axis.property, axis.aggregation, conv)
                        }
                      />

                      <AggregationSelect
                        aggregation={axis.aggregation}
                        setAggregation={(agg) =>
                          setAxisY(index, axis.property, agg, axis.conversion)
                        }
                      />

                      <DeleteAxisYButton onDelete={() => removeAxisY(index)} />
                    </PopoverContent>
                  </Popover>
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

const AggregationSelect = ({
  aggregation,
  setAggregation,
}: {
  aggregation: string | undefined;
  setAggregation: (agg: string | undefined) => void;
}) => {
  const t = useTranslations("pages.chart.edit.nav");
  return (
    <Field>
      <FieldLabel htmlFor="database">{t("axis.aggregation.label")}</FieldLabel>
      <Select
        value={aggregation || "none"}
        onValueChange={(value) =>
          setAggregation(value === "none" ? undefined : value)
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">{t("axis.aggregation.none")}</SelectItem>
            <SelectItem value="sum">{t("axis.aggregation.sum")}</SelectItem>
            <SelectItem value="average">
              {t("axis.aggregation.average")}
            </SelectItem>
            <SelectItem value="count">{t("axis.aggregation.count")}</SelectItem>
            <SelectItem value="min">{t("axis.aggregation.min")}</SelectItem>
            <SelectItem value="max">{t("axis.aggregation.max")}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
};

const ConvertSelect = ({
  conversion,
  setConversion,
}: {
  conversion: string | undefined;
  setConversion: (conv: string | undefined) => void;
}) => {
  const t = useTranslations("pages.chart.edit.nav");
  return (
    <Field>
      <FieldLabel htmlFor="conversion">{t("axis.conversion.label")}</FieldLabel>
      <Select
        value={conversion || "none"}
        onValueChange={(value) =>
          setConversion(value === "none" ? undefined : value)
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="none">{t("axis.conversion.none")}</SelectItem>
            <SelectItem value="percentage">
              {t("axis.conversion.percentage")}
            </SelectItem>
            <SelectItem value="number">
              {t("axis.conversion.number")}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
};

const DeleteAxisYButton = ({ onDelete }: { onDelete: () => void }) => {
  const t = useTranslations("pages.chart.edit.nav");

  return (
    <Button className="w-full" variant="outline" onClick={onDelete}>
      {t("remove")} <Trash2Icon className="text-destructive" />
    </Button>
  );
};
