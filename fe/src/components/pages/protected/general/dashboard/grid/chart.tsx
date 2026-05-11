"use client";

import { MoreVerticalIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ChartIcon } from "@/components/block/chart/icons";
import { AvatarInfo } from "@/components/ui/avatar-info";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Chart } from "@/models/chart";
import {
  ChartDropdownMenuEditOption,
  ChartDropdownMenuShareOption,
  ChartDropdownMenuDeleteOption,
  ChartDropdownMenuExcludeFromDashboardOption,
  ChartDropdownMenuSaveOption,
} from "@/components/block/chart/dropdown-menu-options";
import { useChartExport } from "@/hooks/use-chart-export";
import { toast } from "sonner";

export function GridChart({ chart }: { chart: Chart }) {
  const locale = useLocale();
  return (
    <Card data-tour-step-id="grid-chart" className="size-full shadow-none p-6">
      <CardHeader className="grid-rows-1 grid-cols-[min-content_auto_min-content] items-center p-0">
        <AvatarInfo
          title={chart.name}
          icon={<ChartIcon type={chart.type} is_public={chart.is_public} />}
        />
        <DropdownOptions id={chart.id} name={chart.name} />
      </CardHeader>
      {process.env.NEXT_PUBLIC_OMIT_IFRAME_FOR_SPEEDUP_DEV ? null : (
        <iframe
          key={`grid-chart-view-${chart.id}`}
          src={`/${locale}/chart/${chart.id}/view`}
          title={chart.name}
          className="size-full border-none grid-chart-view"
          frameBorder={0}
          allowFullScreen
        />
      )}
    </Card>
  );
}

const DropdownOptions = ({ id, name }: { id: string; name: string }) => {
  const t = useTranslations("pages.dashboard.grid");
  const { exportChart } = useChartExport(id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon />
        <span className="sr-only">{t("more")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" side="bottom" align="end">
        <ChartDropdownMenuEditOption id={id} t={t} />
        <ChartDropdownMenuShareOption id={id} t={t} />
        <ChartDropdownMenuSaveOption
          t={t}
          onExport={(format) => {
            exportChart(format, name).then((success) => {
              if (success) {
                toast.success(t("exportSuccess"));
              } else {
                toast.error(t("exportError"));
              }
            });
          }}
        />
        <DropdownMenuSeparator />
        <ChartDropdownMenuDeleteOption id={id} t={t} />
        <ChartDropdownMenuExcludeFromDashboardOption id={id} t={t} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
