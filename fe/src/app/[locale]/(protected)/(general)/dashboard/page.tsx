import {
  AddChart,
  AddWorkspace,
} from "@/pages/protected/dashboard/empty-state";
import { DashboardPage } from "@/pages/protected/dashboard/page";
import { useMessages } from "next-intl";

export { generateStaticParams } from "@/i18n/static-params";

export default function Page() {
  const msg = useMessages();

  return (
    <DashboardPage
      addWorkspace={<AddWorkspace />}
      addChart={<AddChart />}
      dashboardMessages={{
        ...msg.pages.dashboard.grid,
      }}
      tourMessages={{
        dashboard: msg.tours.dashboard,
        nav: msg.tours.nav,
      }}
    />
  );
}
