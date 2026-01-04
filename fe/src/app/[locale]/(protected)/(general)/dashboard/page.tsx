import {
  AddChart,
  AddWorkspace,
} from "@/pages/protected/dashboard/empty-state";
import { DashboardPage } from "@/pages/protected/dashboard/page";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  return (
    <DashboardPage addWorkspace={<AddWorkspace />} addChart={<AddChart />} />
  );
}
