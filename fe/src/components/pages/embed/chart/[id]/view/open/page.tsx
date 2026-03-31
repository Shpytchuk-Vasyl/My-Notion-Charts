import { ChartErrorView } from "@/components/block/chart/error-view";
import type { ChartThemeType } from "@/components/block/chart/themes";
import { ChartView } from "@/components/block/chart/view";
import { ChartService } from "@/services/chart";
import { NotionService } from "@/services/notion";

export async function OpenEmbededChartViewPage({ id }: { id: string }) {
  const chart = await ChartService.getOpenChartByIdWithWorkspace(id);

  try {
    const { chartData, chartLabels } = await new NotionService(
      chart.workspaces.access_token,
    ).getChartData(chart, true);

    const xKey = chart.config.axis.x?.property;
    const yKeys = chart.config.axis.y.map((axis) => axis.property);

    return (
      <ChartView
        xKey={xKey}
        yKeys={yKeys}
        theme={chart.config.customization.theme as ChartThemeType}
        id={chart.id}
        type={chart.type}
        chartData={chartData}
        labels={chartLabels}
        className="h-dvh"
      />
    );
  } catch (error: any) {
    return (
      <ChartErrorView
        error={error.message}
        className="border-none p-0 shadow-none"
      />
    );
  }
}
