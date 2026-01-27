import { CreateChartModal } from "@/pages/protected/general/dashboard/chart/new/modal";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  return <CreateChartModal isIntercepted={true} />;
}
