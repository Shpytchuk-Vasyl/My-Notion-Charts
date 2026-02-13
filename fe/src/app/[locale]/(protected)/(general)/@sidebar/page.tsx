import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavCharts } from "@/pages/protected/general/sidebar/nav-charts";
import { NavMain } from "@/pages/protected/general/sidebar/nav-main";
import { NavSecondary } from "@/pages/protected/general/sidebar/nav-secondary";
import { NavUser } from "@/pages/protected/general/sidebar/nav-user";
import { NavWorkspace } from "@/pages/protected/general/sidebar/nav-workspace";

export { generateStaticParams } from "@/i18n/static-params";

export default async function AppSidebar() {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={{ nav: messages.nav }}>
      <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
        <SidebarHeader>
          <NavWorkspace editable />
        </SidebarHeader>
        <SidebarContent>
          <NavCharts />
          <NavMain />
          <NavSecondary className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
    </NextIntlClientProvider>
  );
}
