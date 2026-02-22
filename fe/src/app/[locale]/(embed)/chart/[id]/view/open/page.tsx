import { OpenEmbededChartViewPage } from "@/pages/embed/chart/[id]/view/open/page";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  return <OpenEmbededChartViewPage id={id} />;
}
