import { ChartIcon } from "@/components/block/chart/icons";
import { AvatarInfo } from "@/components/ui/avatar-info";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, routing } from "@/i18n/routing";
import { Chart } from "@/models/chart";
import { Folder, MoreVertical, Share, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export function GridChart({ chart }: { chart: Chart }) {
  const t = useTranslations("pages.dashboard.charts.new.chartType");
  return (
    <Card className="size-full shadow-none">
      <CardHeader className="grid-rows-1 grid-cols-[min-content_auto_min-content] items-center">
        <AvatarInfo
          title={chart.name}
          description={t(chart.type)}
          icon={<ChartIcon type={chart.type} />}
        />
        <DropdownOptions id={chart.id} />
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 pt-6"></CardContent>
    </Card>
  );
}

const DropdownOptions = ({ id }: { id: string }) => {
  const t = useTranslations("pages.dashboard.charts.nav");

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
