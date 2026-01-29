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

export const JoinsAccordionItem = () => {
  const { isLoading, availableJoins, joins, onChangeJoin } =
    useBuilderContext();

  if (isLoading || availableJoins.length === 0) {
    return null;
  }

  return (
    <AccordionItem value="chart-joins">
      <AccordionTrigger>З'єднання</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          {availableJoins.map((join, index) => (
            <div
              className="grid grid-cols-2 gap-2"
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
                  onValueChange={(value) =>
                    onChangeJoin(index, value, undefined)
                  }
                >
                  <SelectTrigger id={`join${join.name}From`} className="w-full">
                    <SelectValue placeholder="Властивість" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {join.from.map(({ id, name, type }) => (
                        <SelectItem
                          key={`join-${join.name}-from-${id}`}
                          value={id}
                        >
                            <PropertyIcon type={type as any} className="h-4 w-4" />
                            {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
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
                    <SelectValue placeholder="Властивість" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {join.to.map(({ id, name, type }) => (
                        <SelectItem
                          key={`join-${join.name}-to-${id}`}
                          value={id}
                        >
                            <PropertyIcon type={type as any} className="h-4 w-4" />
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
