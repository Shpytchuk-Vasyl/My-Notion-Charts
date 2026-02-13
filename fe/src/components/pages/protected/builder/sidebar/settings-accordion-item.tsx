import { useTranslations } from "next-intl";
import { chartIcons } from "@/components/block/chart/icons";
import {
  type ChartThemeType,
  getChartThemeStyles,
} from "@/components/block/chart/themes";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

export const SettingsAccordionItem = () => {
  const t = useTranslations("pages.chart.edit.nav.settings");
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
      <AccordionTrigger>{t("title")}</AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="px-2">
          <Field>
            <FieldLabel htmlFor="chartName">{t("chartName")}:</FieldLabel>
            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Input
                id="chartName"
                placeholder={t("chartNamePlaceholder")}
                minLength={2}
                maxLength={50}
                defaultValue={name}
                onBlur={(e) => setName(e.target.value)}
              />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="chartType">{t("chartType.title")}:</FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="chartType" className="w-full">
                  <SelectValue placeholder={t("chartType.placeholder")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {Object.entries(chartIcons).map(([value, Icon]) => (
                      <SelectItem
                        key={`chart-type-field-${value}`}
                        value={value}
                      >
                        <Icon />
                        {t(`chartType.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="chartTheme">
              {t("chartTheme.title")}:
            </FieldLabel>

            {isLoading && <Skeleton className="h-9 w-full" />}

            {!isLoading && (
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger
                  id="chartTheme"
                  className="w-full"
                  style={getChartThemeStyles(theme as ChartThemeType)}
                >
                  <SelectValue placeholder={t("chartTheme.placeholder")} />
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
                        {t(`chartTheme.${name}`)}
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
