import { DeleteChartModal } from "@/pages/protected/dashboard/chart/[id]/delete/modal";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <DeleteChartModal params={params} />;
}
