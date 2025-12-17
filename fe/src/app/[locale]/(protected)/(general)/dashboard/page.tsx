import {
  AddChart,
  AddWorkspace,
} from "@/components/pages/protected/dashboard/empty-state";
import { DashboardPage } from "@/components/pages/protected/dashboard/page";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  return (
    <DashboardPage addWorkspace={<AddWorkspace />} addChart={<AddChart />} />
  );
}
