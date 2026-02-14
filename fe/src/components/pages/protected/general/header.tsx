"use client";

import { SiteBreadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchForm } from "./sidebar/search-form";
import { routing, usePathname as i18usePathname } from "@/i18n/routing";
import { useParams, usePathname } from "next/navigation";
import { useProtectedContext } from "../context";
import { useMemo } from "react";
import { SuspenseSkeleton } from "@/components/ui/skeleton-suspense";

type AppHeaderProps = {
  translations: {
    dashboard: string;
  };
};

export function AppHeader(props: AppHeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb translations={props.translations} />
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}

const Breadcrumb = ({ translations: { dashboard } }: AppHeaderProps) => {
  const pathname = usePathname();
  const params = useParams();
  const i18Pathname = i18usePathname();
  const { charts } = useProtectedContext();

  const list = useMemo(() => {
    const dashboardItem = [
      {
        title: dashboard,
        url: routing.pathnames["/dashboard"],
      },
    ] as any[];

    switch (i18Pathname) {
      case routing.pathnames["/chart/[id]"]:
        dashboardItem.push({
          title: (
            <SuspenseSkeleton
              className="h-8 w-32"
              promise={
                new Promise((resolve) => {
                  const id = params.id;
                  if (!id || !charts) return resolve("-");

                  charts.then((charts) => {
                    const chart = charts.find((c) => c.id == id);
                    if (!chart) return resolve("-");
                    resolve(chart.name);
                  });
                })
              }
            />
          ),
          url: `/${pathname.split("/").slice(1, -1).join("/")}`,
        });
        return dashboardItem;

      default:
        return dashboardItem;
    }
  }, [i18Pathname, params]);

  return <SiteBreadcrumb list={list} />;
};
