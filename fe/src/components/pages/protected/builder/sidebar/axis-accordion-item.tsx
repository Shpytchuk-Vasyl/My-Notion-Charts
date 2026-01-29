import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

export const AxisAccordionItem = () => {
  const {
    axisX,
    setAxisX,
    axisY,
    setAxisY,
    addAxisY,
    isLoading,
    availableAxisProperties,
  } = useBuilderContext();

  return (
    <AccordionItem value="chart-axis">
      <AccordionTrigger>Осі</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          <Field>
            <FieldLabel htmlFor="axisX">Вісь X:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select value={axisX} onValueChange={setAxisX}>
                <SelectTrigger id="axisX" className="w-full">
                  <SelectValue placeholder={"Виберіть власивість"} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {availableAxisProperties.map(({ name, value, type }) => (
                      <SelectItem
                        key={`axis-x-property-${value}`}
                        value={value}
                      >
                          <PropertyIcon type={type as any} className="h-4 w-4" />
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
              <FieldLabel htmlFor={`axisY-${index}`}>Вісь Y:</FieldLabel>

              {isLoading && <Skeleton className="h-9 w-full" />}

              {!isLoading && (
                <Select
                  value={axis.property}
                  onValueChange={(value) =>
                    setAxisY(index, value, axis.aggregation)
                  }
                >
                  <SelectTrigger id={`axisY-${index}`} className="w-full">
                    <SelectValue placeholder={"Виберіть властивість"} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {availableAxisProperties.map(({ name, value, type }) => (
                        <SelectItem
                          key={`axis-y-property-${value}-${index}`}
                          value={value}
                        >
                          <div className="flex items-center gap-2">
                            <PropertyIcon type={type as any} className="h-4 w-4" />
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </Field>
          ))}

          <Button variant="secondary" onClick={addAxisY}>
            Додати вісь Y
          </Button>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
