export { generateStaticParams } from "@/i18n/static-params";

import { ChartService } from "@/services/chart";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const chart = await ChartService.getChartById((await params).id);
  return chart.name;
}
