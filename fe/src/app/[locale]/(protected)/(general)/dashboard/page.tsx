import { useMessages } from "next-intl";
import {
  AddChart,
  AddWorkspace,
  DropChart,
} from "@/pages/protected/general/dashboard/empty-state";
import { DashboardPage } from "@/pages/protected/general/dashboard/page";

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
      dropChart={<DropChart />}
      tourMessages={{
        dashboard: msg.tours.dashboard,
        nav: msg.tours.nav,
      }}
    />
  );
}
