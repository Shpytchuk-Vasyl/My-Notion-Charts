import { DeleteChartModal } from "@/pages/protected/general/chart/[id]/delete/modal";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <DeleteChartModal params={params} isIntercepted />;
}
