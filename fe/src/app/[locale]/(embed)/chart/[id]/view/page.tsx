import { type ChartThemeType } from "@/components/block/chart/themes";
import { ChartView } from "@/components/block/chart/view";
import { ChartService } from "@/services/chart";
import { NotionService } from "@/services/notion";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const chart = await ChartService.getChartByIdWithWorkspace((await params).id);

  const { chartData, chartLabels } = await new NotionService(
    chart.workspaces.access_token,
  ).getChartData(chart);

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
    />
  );
}
