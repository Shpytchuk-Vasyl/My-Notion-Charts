import { ChartPage } from "@/pages/protected/general/chart/[id]/page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChartPage id={id} />;
}
