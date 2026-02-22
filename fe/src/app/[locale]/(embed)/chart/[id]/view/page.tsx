import { EmbededChartViewPage } from "@/pages/embed/chart/[id]/view/page";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <EmbededChartViewPage id={id} />;
}
