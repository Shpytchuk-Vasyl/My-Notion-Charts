import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { chartIcons } from "@/components/block/chart/icons";
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
import { DatabaseSelect } from "./database-select";

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
      <DatabaseSelect placeholder={t("databasePlaceholder")} />
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
                <Icon />
                {t(`chartType.${value}`)}
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
