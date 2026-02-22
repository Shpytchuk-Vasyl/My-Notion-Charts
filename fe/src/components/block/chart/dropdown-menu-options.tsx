"use client";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { type ExportFormat } from "@/hooks/use-chart-export";
import { Link, routing } from "@/i18n/routing";
import { useGridStackContext } from "@/lib/gridstack";
import {
  BarChart3,
  CircleMinus,
  Download,
  FileCode,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  Folder,
  Share,
  Trash2,
} from "lucide-react";
import { type _Translator } from "next-intl";

type ChartDropdownMenuOptionProps = {
  id: string;
  t: _Translator<Record<string, any>, any>;
};

export function ChartDropdownMenuEditOption({
  id,
  t,
}: ChartDropdownMenuOptionProps) {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={{
          pathname: routing.pathnames["/chart/[id]/edit"],
          params: {
            id,
          },
        }}
      >
        <Folder />
        <span>{t("edit")}</span>
      </Link>
    </DropdownMenuItem>
  );
}

export function ChartDropdownMenuDeleteOption({
  id,
  t,
}: ChartDropdownMenuOptionProps) {
  return (
    <DropdownMenuItem variant="destructive" asChild>
      <Link
        href={{
          pathname: routing.pathnames["/dashboard/chart/[id]/delete"],
          params: {
            id,
          },
        }}
      >
        <Trash2 className="text-destructive" />
        <span>{t("delete")}</span>
      </Link>
    </DropdownMenuItem>
  );
}

export function ChartDropdownMenuShareOption({
  id,
  t,
}: ChartDropdownMenuOptionProps) {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={{
          pathname: routing.pathnames["/chart/[id]/share"],
          params: {
            id,
          },
        }}
      >
        <Share />
        <span>{t("share")}</span>
      </Link>
    </DropdownMenuItem>
  );
}

export function ChartDropdownMenuExcludeFromDashboardOption({
  id,
  t,
}: ChartDropdownMenuOptionProps) {
  const { removeWidget } = useGridStackContext();

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() => {
        removeWidget(id);
      }}
    >
      <CircleMinus className="text-destructive" />
      <span>{t("exclude")}</span>
    </DropdownMenuItem>
  );
}

const EXPORT_FORMATS: Array<{
  value: ExportFormat;
  label: string;
  icon: typeof Download;
}> = [
  { value: "png", label: "PNG", icon: FileImage },
  { value: "csv", label: "CSV", icon: FileSpreadsheet },
  { value: "json", label: "JSON", icon: FileJson },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "svg", label: "SVG", icon: FileCode },
  { value: "power-bi", label: "Power BI", icon: BarChart3 },
];

export function ChartDropdownMenuSaveOption({
  t,
  onExport,
}: Pick<ChartDropdownMenuOptionProps, "t"> & {
  onExport: (format: ExportFormat) => void | Promise<void>;
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Download />
        <span>{t("save")}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {EXPORT_FORMATS.map((format) => (
          <DropdownMenuItem
            key={`chart-export-format-${format.value}`}
            onClick={() => {
              onExport(format.value);
            }}
          >
            <format.icon />
            <span>{format.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
