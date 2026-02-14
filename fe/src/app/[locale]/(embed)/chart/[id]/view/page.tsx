import { EmbededChartViewPage } from "@/pages/embed/chart/[id]/view/page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmbededChartViewPage id={id} />;
}
