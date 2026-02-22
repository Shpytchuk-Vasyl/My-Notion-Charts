"use client";

import { MoreVertical } from "lucide-react";
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
} from "@/components/block/chart/dropdown-menu-options";

export function GridChart({ chart }: { chart: Chart }) {
  const t = useTranslations("pages.dashboard.grid.chartType");
  const locale = useLocale();
  return (
    <Card data-tour-step-id="grid-chart" className="size-full shadow-none p-6">
      <CardHeader className="grid-rows-1 grid-cols-[min-content_auto_min-content] items-center p-0">
        <AvatarInfo
          title={chart.name}
          description={t(chart.type)}
          icon={<ChartIcon type={chart.type} />}
        />
        <DropdownOptions id={chart.id} />
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

const DropdownOptions = ({ id }: { id: string }) => {
  const t = useTranslations("pages.dashboard.grid");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
        <span className="sr-only">{t("more")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" side="bottom" align="end">
        <ChartDropdownMenuEditOption id={id} t={t} />
        <ChartDropdownMenuShareOption id={id} t={t} />
        <DropdownMenuSeparator />
        <ChartDropdownMenuDeleteOption id={id} t={t} />
        <ChartDropdownMenuExcludeFromDashboardOption
          id={id}
          t={useTranslations("pages.dashboard.grid")}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
