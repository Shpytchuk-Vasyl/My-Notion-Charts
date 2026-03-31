import { ChartEditPage } from "@/pages/protected/builder/chart/[id]/edit/page";
import { ChartService } from "@/services/chart";
import { NotionService } from "@/services/notion";
import type { ChartThemeType } from "@/components/block/chart/themes";
import { ChartErrorView } from "@/components/block/chart/error-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const chart = await ChartService.getChartByIdWithWorkspace(id);

  try {
    const { chartData, chartLabels } = await new NotionService(
      chart.workspaces.access_token,
    ).getChartData(chart);

    const xKey = chart.config.axis.x?.property;
    const yKeys = chart.config.axis.y.map((axis) => axis.property);

    return (
      <ChartEditPage
        xKey={xKey}
        yKeys={yKeys}
        theme={chart.config.customization.theme as ChartThemeType}
        id={id}
        type={chart.type}
        chartData={chartData}
        labels={chartLabels}
      />
    );
  } catch (error: any) {
    return (
      <ChartErrorView
        error={error.message}
        className="place-self-center my-auto mx-4 p-6"
      />
    );
  }
}
