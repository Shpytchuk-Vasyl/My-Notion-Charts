"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Link, routing } from "@/i18n/routing";
import { useGridStackContext } from "@/lib/gridstack";
import { CircleMinus, Folder, Share, Trash2 } from "lucide-react";
import { type _Translator } from "next-intl";

type ChartDropdownMenuEditOptionProps = {
  id: string;
  t: _Translator<Record<string, any>, any>;
};

export function ChartDropdownMenuEditOption({
  id,
  t,
}: ChartDropdownMenuEditOptionProps) {
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
}: ChartDropdownMenuEditOptionProps) {
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
}: ChartDropdownMenuEditOptionProps) {
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
}: ChartDropdownMenuEditOptionProps) {
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
