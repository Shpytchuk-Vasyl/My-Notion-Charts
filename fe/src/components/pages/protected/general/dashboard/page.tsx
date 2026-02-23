"use client";

import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl";
import { use } from "react";
import { TourProvider } from "@/components/ui/tour";
import { useProtectedContext } from "../../context";
import { ChartGrid } from "./grid/grid";
import { getTours } from "./tour";

export function DashboardPage({
  addWorkspace,
  addChart,
  dropChart,
  dashboardMessages,
  tourMessages,
}: {
  addWorkspace: React.ReactNode;
  addChart: React.ReactNode;
  dropChart: React.ReactNode;
  tourMessages: Record<string, string>;
  dashboardMessages: Record<string, string>;
}) {
  const { workspaces, charts } = useProtectedContext();
  const locale = useLocale();

  const workspacesData = use(workspaces);
  const chartsData = use(charts);

  if (workspacesData.length === 0) {
    return addWorkspace;
  }

  if (chartsData.length === 0) {
    return addChart;
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={{
        pages: { dashboard: { grid: dashboardMessages } },
        tours: tourMessages,
      }}
    >
      <Tours>
        <ChartGrid charts={chartsData}>{dropChart}</ChartGrid>
      </Tours>
    </NextIntlClientProvider>
  );
}

const Tours = ({ children }: React.PropsWithChildren<{}>) => {
  const t = useTranslations("tours.nav");
  return (
    <TourProvider
      tours={getTours(useTranslations("tours.dashboard"))}
      translations={{
        next: t("next"),
        previous: t("previous"),
        finish: t("finish"),
        step: t("step"),
        of: t("of"),
      }}
    >
      {children}
    </TourProvider>
  );
};
