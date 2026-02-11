"use client";
import { ChartIcon } from "@/components/block/chart/icons";
import { AvatarInfo } from "@/components/ui/avatar-info";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, routing } from "@/i18n/routing";
import { useGridStackContext } from "@/lib/gridstack";
import { type Chart } from "@/models/chart";
import { CircleMinus, Folder, MoreVertical, Share, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
      <iframe
        key={`grid-chart-view-${chart.id}`}
        src={`/${locale}/chart/${chart.id}/view`}
        title={chart.name}
        className="size-full border-none grid-chart-view"
        frameBorder={0}
        allowFullScreen
      />
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
        <DropdownMenuItem>
          <Share />
          <span>{t("share")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
        <ExcludeFromDashboard id={id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ExcludeFromDashboard = ({ id }: { id: string }) => {
  const t = useTranslations("pages.dashboard.grid");
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
};
