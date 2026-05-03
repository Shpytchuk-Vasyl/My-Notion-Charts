import { ShareChartModal } from "@/pages/protected/general/chart/[id]/share/modal";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ShareChartModal params={params} />;
}
