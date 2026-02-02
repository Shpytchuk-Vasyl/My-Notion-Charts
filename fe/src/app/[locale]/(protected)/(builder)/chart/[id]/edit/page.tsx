export { generateStaticParams } from "@/i18n/static-params";

import { ChartView } from "@/components/block/chart/view";
import { ChartService } from "@/services/chart";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const chart = await ChartService.getChartByIdWithWorkspace((await params).id);
  console.log(chart, "chart@@@@@@@@@@@");
  return <ChartView chart={chart} />;
}
