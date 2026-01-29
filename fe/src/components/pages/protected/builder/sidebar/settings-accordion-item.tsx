import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { chartIcons } from "@/components/block/chart/icons";
import { Input } from "@/components/ui/input";
import {
  getChartThemeStyles,
  type ChartThemeType,
} from "@/components/block/chart/themes";

export const SettingsAccordionItem = () => {
  const {
    name,
    type,
    setType,
    setName,
    theme,
    setTheme,
    availableThemes,
    isLoading,
  } = useBuilderContext();

  return (
    <AccordionItem value="chart-configuration">
      <AccordionTrigger>Налаштування</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          <Field>
            <FieldLabel htmlFor="chartName">Назва графіка:</FieldLabel>
            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Input
                id="chartName"
                placeholder={"Введіть назву графіка"}
                minLength={2}
                maxLength={50}
                defaultValue={name}
                onBlur={(e) => setName(e.target.value)}
              />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="chartType">Тип графіка:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="chartType" className="w-full">
                  <SelectValue placeholder={"Виберіть тип графіка"} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {Object.entries(chartIcons).map(([value, Icon]) => (
                      <SelectItem
                        key={`chart-type-field-${value}`}
                        value={value}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          <span>{value}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="chartTheme">Тема графіка:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger
                  id="chartTheme"
                  className="w-full"
                  style={getChartThemeStyles(theme as ChartThemeType)}
                >
                  <SelectValue placeholder={"Виберіть тему графіка"} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {availableThemes.map(({ name, value }) => (
                      <SelectItem
                        key={`chart-theme-field-${name}`}
                        value={value}
                        className="chart-theme"
                        style={getChartThemeStyles(value as ChartThemeType)}
                      >
                        {name}
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={`chart-theme-color-${name}-${index}`}
                            className="inline-block size-2 mr-1 rounded"
                            style={{
                              backgroundColor: `var(--chart-${index + 1})`,
                            }}
                          />
                        ))}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Field>
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  );
};
