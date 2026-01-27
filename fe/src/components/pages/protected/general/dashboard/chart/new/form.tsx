import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { chartIcons } from "@/components/block/chart/icons";
import { DatabaseSelect } from "./database-select";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getDatabeses } from "@/app/[locale]/(protected)/(general)/dashboard/actions";

export function NewChartForm() {
  const t = useTranslations("pages.dashboard.charts.new");

  return (
    <FieldGroup>
      <ChartNameField t={t} />

      <DatabaseField t={t} />

      <ChartTypeField t={t} />
    </FieldGroup>
  );
}

type DatabaseFieldProps = {
  t: (key: string) => string;
};

function DatabaseField({ t }: DatabaseFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="database">{t("databaseLabel")}</FieldLabel>
      <Suspense fallback={<Skeleton className="h-9 w-full" />}>
        <DatabaseSelect
          placeholder={t("databasePlaceholder")}
          promise={getDatabeses()}
        />
      </Suspense>
    </Field>
  );
}

function ChartTypeField({ t }: DatabaseFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="chart-type">{t("chartTypeLabel")}</FieldLabel>
      <Select
        name="chartType"
        autoComplete="chartType"
        defaultValue="bar"
        required
      >
        <SelectTrigger id="chart-type" className="w-full">
          <SelectValue placeholder={t("chartTypePlaceholder")} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {Object.entries(chartIcons).map(([value, Icon]) => (
              <SelectItem key={`chart-type-field-${value}`} value={value}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span>{t(`chartType.${value}`)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

function ChartNameField({ t }: DatabaseFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="chartName">{t("nameLabel")}</FieldLabel>
      <Input
        id="chartName"
        name="chartName"
        placeholder={t("namePlaceholder")}
        defaultValue={"My Chart"}
        required
        minLength={2}
        maxLength={50}
      />
    </Field>
  );
}
